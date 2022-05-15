import { v4 as uuid } from "uuid";
import SQL, { SQLStatement } from "sql-template-strings";
import { JustId, Order, User, UsersSearchRequest } from "../../types/api";
import * as bcrypt from "../helpers/bcrypt";
import db from "../helpers/db";
import HTTPError from "../helpers/HTTPError";
import * as emails from "../helpers/emails";
import { qsStringify } from "../../client/helpers/utils";

type UserUpdateFields = Pick<Partial<User>, "username" | "email" | "verified" | "admin" | "banned"> & { password?: string };

export async function update(id: string, fields: UserUpdateFields) {
  const update = db.updateFields({
    username: fields.username,
    email: fields.email,
    verified: fields.verified,
    admin: fields.admin,
    banned: fields.banned,
    password: fields.password && await bcrypt.hash(fields.password),
  });
  
  if(!update) return;
  
  await db.query(SQL`
    UPDATE users
    SET `.append(update)
         .append(SQL`
    WHERE id = ${id}
  `));
}

export async function checkPassword(id: string, password: string) {
  const user = await db.queryFirst<{ password: string }>(SQL`
    SELECT password
    FROM users
    WHERE id = ${id}
  `);
  
  if(!user) throw new HTTPError(404, "User does not exists");
  
  const same = await bcrypt.compare(password, user.password!);
  if(!same) throw new HTTPError(400, "Invalid password");
}

export async function login(email: string, password: string, ip: string): Promise<User> {
  const user = await db.queryFirst<User & { password?: string }>(SQL`
    SELECT id, username, email, verified, from_timestamp_ms(created) as created, password, admin
    FROM users
    WHERE email = ${email}
  `);
  
  if(!user) throw new HTTPError(400, "Invalid email or password");
  if(!user.verified) throw new HTTPError(400, "You need to verify your email first.");
  
  const same = await bcrypt.compare(password, user.password!);
  if(!same) throw new HTTPError(400, "Invalid email or password");
  
  delete user.password;
  
  await db.query(SQL`
    UPDATE users SET last_login_ip = ${ip} WHERE id = ${user.id}
  `);
  
  return user;
}

interface RegisterUser {
  email: string;
  password: string;
  username: string;
  baseUrl: string;
}

export async function register(user: RegisterUser) {
  const userId = uuid();
  const verified = !emails.isConfigured();
  const verifyToken = uuid();
  const passwordHash = await bcrypt.hash(user.password);
  
  if(!verified) {
    const verifyUrl = `${user.baseUrl}/verifyEmail${qsStringify({ token: verifyToken })}`;
    const title = "OpenViva - Verify Mail";
    const content = `
      <p>Press the button to verify this email address.</p>
      <button>
        <a title="Activate my account" href="${verifyUrl}" target="_blank" style="text-decoration: none;color: #4d5bc7;">Verify Email</a>
      </button>
      <p>Alternatively you can use link below:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `;
    
    await emails.send({ name: user.username, content, title, baseUrl: user.baseUrl, recipient: user.email });
  }
  
  await db.query<JustId>(SQL`
    INSERT INTO users(id, email, password, username, verified, verify_token, admin)
    VALUES (${userId},
            ${user.email},
            ${passwordHash},
            ${user.username},
            ${verified},
            ${verifyToken},
            NOT EXISTS(SELECT 1 FROM users))
  `);
  
  return verified;
}

export const sortColumns = ["id", "name", "created"];

export async function search({ text, page = 0, pageSize = 50, ids, sort = "created", order = Order.DESC, verified, banned }: UsersSearchRequest) {
  const where: SQLStatement[] = [];
  if(text) where.push(...db.freeTextQuery(text, ["users.username", "users.email"]));
  if(ids && ids.length > 0) where.push(SQL`users.id = ANY(${ids})`);
  if(verified !== undefined) where.push(SQL`users.verified = ${verified}`);
  if(banned !== undefined) where.push(SQL`users.banned = ${banned}`);
  const whereSQL = db.combineWhere(where);
  
  if(!sortColumns.includes(sort)) throw new HTTPError(400, "Invalid sorting column!");
  if(!Object.values(Order).includes(order as Order)) throw new HTTPError(400, "Invalid sorting order!");
  
  return await db.queryAll<User>(SQL`
    SELECT
      users.id,
      users.username,
      users.email,
      users.verified,
      users.created,
      users.admin,
      users.banned,
      users.last_login_ip as "lastLoginIp"
    FROM users
    `.append(whereSQL)
     .append(`ORDER BY users.${sort} ${order}`)
     .append(SQL`
    LIMIT ${pageSize}
    OFFSET ${page * pageSize}
  `));
}

export async function get(id: string) {
  const [user] = await search({ ids: [id], pageSize: 1 });
  
  return user || null;
}

export async function verifyEmail(token: string) {
  const result = await db.queryFirst(SQL`
    UPDATE users
    SET verified = true
    WHERE verify_token = ${token}
    RETURNING 1
  `);
  
  return !!result;
}

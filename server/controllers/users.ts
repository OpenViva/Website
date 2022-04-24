import { v4 as uuid } from "uuid";
import SQL from "sql-template-strings";
import { JustId, User } from "../../types/api";
import * as bcrypt from "../helpers/bcrypt";
import db from "../helpers/db";
import HTTPError from "../helpers/HTTPError";

export async function get(id: string) {
  return await db.queryFirst<User>(SQL`
    SELECT id, username, email, confirmed, from_timestamp_ms(created) as created
    FROM users
    WHERE id = ${id}
  `);
}

type UserUpdateFields = Pick<Partial<User>, "username" | "email" | "confirmed"> & { password?: string };

export async function update(id: string, fields: UserUpdateFields) {
  const update = db.updateFields({
    username: fields.username,
    email: fields.email,
    confirmed: fields.confirmed,
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

export async function login(email: string, password: string): Promise<User> {
  const user = await db.queryFirst<User & { password?: string }>(SQL`
    SELECT id, username, email, confirmed, from_timestamp_ms(created) as created, password
    FROM users
    WHERE email = ${email}
  `);
  
  if(!user) throw new HTTPError(400, "Invalid email or password");
  if(!user.confirmed) throw new HTTPError(400, "You need to confirm your email first.");
  
  const same = await bcrypt.compare(password, user.password!);
  if(!same) throw new HTTPError(400, "Invalid email or password");
  
  delete user.password;
  
  return user;
}

interface RegisterUser {
  email: string;
  password: string;
  username: string;
}

export async function register(user: RegisterUser) {
  const userId = uuid();
  const confirmToken = uuid();
  const passwordHash = await bcrypt.hash(user.password);
  
  await db.query<JustId>(SQL`
    INSERT INTO users(id, email, password, username, confirm_token)
    VALUES (${userId}, ${user.email}, ${passwordHash}, ${user.username}, ${confirmToken})
  `);
}

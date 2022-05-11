import path from "path";
import { pipeline } from "stream/promises";
import fs from "fs";
import JSZip from "jszip";
import { loadImage } from "canvas";
import { v4 as uuid } from "uuid";
import SQL, { SQLStatement } from "sql-template-strings";
import sanitize from "sanitize-filename";
import { Asset, AssetCategory, AssetsSearchRequest, AssetSubcategory, JustId, Order } from "../../types/api";
import { createThumbnail, extractCharacterMetadata, extractClothingMetadata } from "../helpers/cardUtils";
import db from "../helpers/db";
import HTTPError from "../helpers/HTTPError";
import configs from "../helpers/configs";

const howToInstall = fs.promises.readFile("./static/HOWTOINSTALL.txt");

export interface CreateFields {
  name: string;
  description: string;
  category: AssetCategory;
  creator: string;
}

export async function create({ name, description, category, creator }: CreateFields, files: Dict<Express.Multer.File>) {
  const id = uuid();
  const assetRoot = path.resolve(configs.storagePath, id);
  let fileName: string;
  let subcategory: AssetSubcategory;
  
  await fs.promises.mkdir(assetRoot, { recursive: true });
  
  if(category === AssetCategory.CLOTHING) {
    const { clothing } = files;
    if(!clothing) throw new Error("Not Enough Cards");
    fileName = sanitize(clothing.originalname, { replacement: "_" });
    
    const image = await loadImage(clothing.buffer);
    subcategory = extractClothingMetadata(image).subcategory;
    
    const thumbnail = createThumbnail(image);
    
    await pipeline(
      thumbnail.createJPEGStream(),
      fs.createWriteStream(path.resolve(assetRoot, "thumbnail.jpg")),
    );
    
    await fs.promises.writeFile(path.resolve(assetRoot, fileName), clothing.buffer);
  } else if(category === AssetCategory.CHARACTER) {
    const { character, skin } = files;
    if(!character || !skin) throw new Error("Not Enough Cards");
    const baseName = sanitize(name, { replacement: "_" });
    fileName = baseName + ".zip";
    subcategory = AssetSubcategory.CHARACTER;
    
    const characterImage = await loadImage(character.buffer);
    extractCharacterMetadata(characterImage);
    const skinImage = await loadImage(character.buffer);
    extractCharacterMetadata(skinImage);
    
    const zip = new JSZip();
    zip.file(`${baseName}/Cards/Characters/${baseName}.png`, character.buffer);
    zip.file(`${baseName}/Cards/Skins/${baseName}.png`, skin.buffer);
    zip.file(`${baseName}/HOWTOINSTALL.txt`, await howToInstall);
    
    await pipeline(
      zip.generateNodeStream(),
      fs.createWriteStream(path.resolve(assetRoot, fileName)),
    );
    
    const thumbnail = createThumbnail(characterImage);
    
    await pipeline(
      thumbnail.createJPEGStream(),
      fs.createWriteStream(path.resolve(assetRoot, "thumbnail.jpg")),
    );
  } else throw new Error("Unreachable");
  
  const result = await db.queryFirst<JustId>(SQL`
    INSERT INTO assets(id, name, description, file, creator, category, subcategory)
    VALUES(
      ${id},
      ${name},
      ${description},
      ${fileName},
      ${creator},
      ${category},
      ${subcategory}
    )
    RETURNING id
  `);
  
  return result!.id;
}

export const sortColumns = ["id", "name", "created"];

export async function search({ text, page = 0, pageSize = 20, ids, sort = "created", order = Order.DESC, category, subcategory }: AssetsSearchRequest) {
  const where: SQLStatement[] = [];
  if(text) where.push(...db.freeTextQuery(text, ["assets.name", "assets.description", "assets.category", "assets.subcategory", "users.username"]));
  if(ids && ids.length > 0) where.push(SQL`assets.id = ANY(${ids})`);
  if(category && category.length > 0) where.push(SQL`assets.category = ANY(${category})`);
  if(subcategory && subcategory.length > 0) where.push(SQL`assets.subcategory = ANY(${subcategory})`);
  const whereSQL = db.combineWhere(where);
  
  if(!sortColumns.includes(sort)) throw new HTTPError(400, "Invalid sorting column!");
  if(!Object.values(Order).includes(order as Order)) throw new HTTPError(400, "Invalid sorting order!");
  
  return await db.queryAll<Asset>(SQL`
    SELECT
      assets.id,
      assets.name,
      assets.description,
      assets.file,
      users.username AS "creatorName",
      assets.category,
      assets.subcategory,
      from_timestamp_ms(assets.created)
    FROM assets
    LEFT JOIN users ON assets.creator = users.id
    `.append(whereSQL)
     .append(`ORDER BY assets.${sort} ${order}`)
     .append(SQL`
    LIMIT ${pageSize}
    OFFSET ${page * pageSize}
  `));
}

import { createCanvas, Image } from "canvas";
import { AssetCategory, AssetSubcategory } from "../../types/api";

export const CARD_METADATA_SIZE = 256;
export const CARD_WIDTH = 1024;
export const CARD_HEIGHT = 1536;
export const CARD_MAX_BYTES = 2363271;

export const subcategoryNames: Record<AssetSubcategory, string> = {
  [AssetSubcategory.UNKNOWN]: "Unknown",
  [AssetSubcategory.CHARACTER]: "Character",
  [AssetSubcategory.BLOUSE]: "Blouse",
  [AssetSubcategory.JACKET]: "Jacket",
  [AssetSubcategory.PANTY]: "Panty",
  [AssetSubcategory.SANDALS]: "Sandals",
  [AssetSubcategory.SWIMSUIT]: "School",
  [AssetSubcategory.SHIRT]: "Shirt",
  [AssetSubcategory.SHOE]: "Shoe",
  [AssetSubcategory.SKIRT]: "Skirt",
  [AssetSubcategory.SPATS]: "Spats",
  [AssetSubcategory.STOCKING]: "Stockings",
  [AssetSubcategory.TOWEL]: "Towel Wrap",
  [AssetSubcategory.TSHIRT]: "T-shirt",
};

export const categoryNames: Record<AssetCategory, string> = {
  [AssetCategory.CLOTHING]: "Clothing",
  [AssetCategory.CHARACTER]: "Character",
};

export function extractClothingMetadata(img: HTMLImageElement | Image) {
  const canvas = createCanvas(Math.ceil(CARD_METADATA_SIZE / 3), 1);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 1535, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = new Uint8Array(256);
  for(let i = 0; i < 256; i++) {
    data[i] = imageData.data[i + Math.floor(i / 3)];
  }
  
  const decoder = new TextDecoder("utf-8");
  
  let pos = 0;
  if(data[pos] !== 1) throw new Error(`Unexpected ${data[pos]} at pos ${pos}`);
  pos++;
  
  if(data[pos] !== 0) throw new Error(`Unexpected ${data[pos]} at pos ${pos}`);
  pos++;
  
  const pieceLength = data[pos];
  pos++;
  
  if(pos + pieceLength > data.length) throw new Error(`Piece name is too long`);
  const pieceName = decoder.decode(data.slice(pos, pos + pieceLength));
  
  pos += pieceLength;
  const textureLength = data[pos];
  
  pos++;
  if(pos + textureLength > data.length) throw new Error(`Texture name is too long`);
  const textureName = decoder.decode(data.slice(pos, pos + textureLength));
  const subcategory = Object.values(AssetSubcategory).includes(pieceName as AssetSubcategory) ? pieceName as AssetSubcategory : AssetSubcategory.UNKNOWN;
  
  return {
    subcategory,
    textureName,
  };
}

export function extractCharacterMetadata(img: HTMLImageElement | Image) {
  const canvas = createCanvas(2, 1);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 1024 - 2, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = new Uint8Array(4);
  
  // Hey b0ss, I have cancer
  data[0] = imageData.data[1];
  data[1] = imageData.data[2];
  data[2] = imageData.data[4];
  data[3] = imageData.data[5];
  
  const payloadLength = data[0]
                      + data[1] * 256
                      + data[2] * 256 * 256
                      + data[3] * 256 * 256 * 256;
  
  if(payloadLength > CARD_MAX_BYTES) throw new Error("Payload is too large");
  
  return { payloadLength };
}

export const THUMBNAIL_WIDTH = 300;
export const THUMBNAIL_HEIGHT = THUMBNAIL_WIDTH / CARD_WIDTH * CARD_HEIGHT;
export const THUMBNAIL_MARGIN = 0.02;

export function createThumbnail(img: HTMLImageElement | Image) {
  const canvas = createCanvas(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
  const ctx = canvas.getContext("2d");
  
  let scaledWidth = img.naturalWidth;
  let scaledHeight = img.naturalHeight;
  if(scaledWidth > THUMBNAIL_WIDTH) {
    scaledHeight = THUMBNAIL_WIDTH / scaledWidth * scaledHeight;
    scaledWidth = THUMBNAIL_WIDTH;
  }
  if(scaledHeight < THUMBNAIL_HEIGHT) {
    scaledWidth = THUMBNAIL_HEIGHT / scaledHeight * scaledWidth;
    scaledHeight = THUMBNAIL_HEIGHT;
  }
  scaledWidth *= 1 + THUMBNAIL_MARGIN;
  scaledHeight *= 1 + THUMBNAIL_MARGIN;
  
  ctx.drawImage(img, (THUMBNAIL_WIDTH - scaledWidth) / 2, (THUMBNAIL_HEIGHT - scaledHeight) / 3, scaledWidth, scaledHeight);
  
  return canvas;
}

import { createCanvas, Image } from "canvas";

export const CARD_METADATA_SIZE = 256;
export const CARD_WIDTH = 1024;
export const CARD_HEIGHT = 1536;
export const CARD_MAX_BYTES = 2363271;

export enum Subcategory {
  UNKNOWN = "unknown",
  CHARACTER = "character",
  BLOUSE = "blouse 1",
  JACKET = "jacket",
  PANTY = "panty 1",
  SANDALS = "sandals 1",
  SWIMSUIT = "school swimsuit",
  SHIRT = "shirt 1",
  SHOE = "shoe 1",
  SKIRT = "skirt 1",
  SPATS = "spats",
  STOCKING = "stockings",
  TOWEL = "towelWrap",
  TSHIRT = "tshirt 1",
}

export const subcategoryNames: Record<Subcategory, string> = {
  [Subcategory.UNKNOWN]: "Unknown",
  [Subcategory.CHARACTER]: "Character",
  [Subcategory.BLOUSE]: "Blouse",
  [Subcategory.JACKET]: "Jacket",
  [Subcategory.PANTY]: "Panty",
  [Subcategory.SANDALS]: "Sandals",
  [Subcategory.SWIMSUIT]: "School",
  [Subcategory.SHIRT]: "Shirt",
  [Subcategory.SHOE]: "Shoe",
  [Subcategory.SKIRT]: "Skirt",
  [Subcategory.SPATS]: "Spats",
  [Subcategory.STOCKING]: "Stockings",
  [Subcategory.TOWEL]: "Towel Wrap",
  [Subcategory.TSHIRT]: "T-shirt",
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
  
  return data;
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
  
  return data;
}

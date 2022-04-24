import bcrypt from "bcrypt";

export const genSalt = (rounds = 10) => new Promise<string>((res, rej) => bcrypt.genSalt(rounds, (err, result) => err ? rej(err) : res(result)));
export const hash = (data: string, salt: string | number = 10) => new Promise<string>((res, rej) => bcrypt.hash(data, salt, (err, result) => err ? rej(err) : res(result)));
export const compare = (data: string, encrypted: string) => new Promise<boolean>((res, rej) => bcrypt.compare(data, encrypted, (err, result) => err ? rej(err) : res(result)));

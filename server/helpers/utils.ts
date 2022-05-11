import HTTPError from "./HTTPError";

interface StringArgs<Req extends boolean = boolean, Null extends boolean = boolean> {
  max?: number | null;
  min?: number | null;
  trim?: boolean | null;
  oneOf?: string[];
  allowNull?: Null;
  required?: Req;
}

export function checkString(string: string | undefined, name: string, args?: StringArgs<true>): string;
export function checkString(string: string | null, name: string, args?: StringArgs<boolean, false>): string;
export function checkString(string: string | null | undefined, name: string, args?: StringArgs<true, false>): string;
export function checkString(string: string | null | undefined, name: string, args?: StringArgs<true, true>): string | null;
export function checkString(string: string | null | undefined, name: string, args?: StringArgs<false, true>): string | undefined;
export function checkString<Str extends string | null | undefined>(string: Str, name: string, args: StringArgs): Str;
export function checkString(string: any, name: string, { max = null, min = 1, trim = false, allowNull = false, required = true, oneOf }: StringArgs = {}): string | null | undefined {
  if(required && !string) throw new HTTPError(400, `Field ${name} is required`);
  if(allowNull && string === null) return null;
  if(string === undefined) return undefined;
  if(typeof string !== "string") throw new HTTPError(400, `Field ${name} must be a string`);
  if(trim) string = string.trim();
  if(oneOf && !oneOf.includes(string)) throw new HTTPError(400, `Field ${name} must be one of: ${oneOf.join(", ")}`);
  if(min !== null && min > 0 && string.length === 0) throw new HTTPError(400, `Field ${name} cannot be empty`);
  if(min !== null && string.length < min) throw new HTTPError(400, `Field ${name} must have at least ${min} characters`);
  if(max !== null && string.length > max) throw new HTTPError(400, `Field ${name} must have at most ${max} characters`);
  
  return string;
}

interface NumberArgs<Req extends boolean = boolean, Null extends boolean = boolean> {
  max?: number | null;
  min?: number | null;
  step?: number | null;
  allowNull?: Null;
  required?: Req;
}
export function checkNumber(input: number | string | undefined, name: string, args?: NumberArgs<true>): number;
export function checkNumber(input: number | string | null, name: string, args?: NumberArgs<boolean, false>): number;
export function checkNumber(input: number | string | null | undefined, name: string, args?: NumberArgs<true, false>): number;
export function checkNumber(input: number | string | null | undefined, name: string, args?: NumberArgs<true, true>): number | null;
export function checkNumber(input: number | string | null | undefined, name: string, args?: NumberArgs<false, true>): number | undefined;
export function checkNumber<Num extends number | string | null | undefined>(input: Num, name: string, args: NumberArgs): Num;
export function checkNumber(input: any, name: string, { max = null, min = null, step = 1, allowNull = false, required = true }: NumberArgs = {}): number | null | undefined {
  if(required && typeof input !== "number" && !input) throw new HTTPError(400, `Field ${name} is required`);
  if(allowNull && input === null) return null;
  if(input === undefined) return undefined;
  
  let number = typeof input === "number" ? input : parseFloat(input);
  
  if(isNaN(number)) throw new HTTPError(400, `Field ${name} must be a number`);
  if(min !== null && number < min) throw new HTTPError(400, `Field ${name} can't be less than ${min}`);
  if(max !== null && number > max) throw new HTTPError(400, `Field ${name} can't be more than ${max}`);
  if(step === 1 && number !== Math.floor(number)) throw new HTTPError(400, `Field ${name} must be a whole number`);
  if(step !== null) number = Math.round(number / step) * step;
  
  return number;
}

interface ArrayArgs<T, Null extends boolean = boolean> {
  max?: number | null;
  min?: number | null;
  allowNull?: Null;
  checkInner?: (element: T, name: string) => T;
}
export function checkArray<T>(array: T[] | null | undefined, name: string, args: ArrayArgs<T, false>): T[];
export function checkArray<T>(array: T[] | null | undefined, name: string, args: ArrayArgs<T, true>): T[] | null;
export function checkArray<T>(array: T[] | null | undefined, name: string, { max = null, min = null, allowNull = false, checkInner }: ArrayArgs<T> = {}): T[] | null {
  if(allowNull && array === null) return null;
  if(array === null) throw new HTTPError(400, `Field ${name} is required`);
  
  if(!Array.isArray(array)) {
    if(array === undefined) array = [];
    else array = [array];
  }
  
  if(min !== null && min > 0 && array.length === 0) throw new HTTPError(400, `Field ${name} is required`);
  if(min !== null && array.length < min) throw new HTTPError(400, `Field ${name} must have at least ${min} members`);
  if(max !== null && array.length > max) throw new HTTPError(400, `Field ${name} must have at most ${max} members`);
  
  if(checkInner) {
    for(let i = 0; i < array.length; i++) {
      array[i] = checkInner(array[i], `${name}[${i}]`);
    }
  }
  
  return array;
}

interface BooleanArgs<Req extends boolean = boolean, Null extends boolean = boolean> {
  allowNull?: Null;
  required?: Req;
}

export function checkBoolean(string: boolean | undefined, name: string, args?: BooleanArgs<true>): boolean;
export function checkBoolean(string: boolean | null, name: string, args?: BooleanArgs<boolean, false>): boolean;
export function checkBoolean(string: boolean | null | undefined, name: string, args?: BooleanArgs<true, false>): boolean;
export function checkBoolean(string: boolean | null | undefined, name: string, args?: BooleanArgs<true, true>): boolean | null;
export function checkBoolean(string: boolean | null | undefined, name: string, args?: BooleanArgs<false, true>): boolean | undefined;
export function checkBoolean<Str extends string | null | undefined>(string: Str, name: string, args: BooleanArgs): Str;
export function checkBoolean(input: any, name: string, { allowNull = false, required = true }: BooleanArgs = {}): boolean | null | undefined {
  if(typeof input === "boolean") return input;
  if(required && !input) throw new HTTPError(400, `Field ${name} is required`);
  if(allowNull && input === null) return null;
  if(input === undefined) return undefined;
  if(input === "true") return true;
  if(input === "false") return false;
  
  throw new HTTPError(400, `Field ${name} must be a boolean`);
}

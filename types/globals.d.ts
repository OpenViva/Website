
declare type ArrayElement<A> = A extends ReadonlyArray<infer T> ? T : never;

declare type Empty = Record<any, never>;

declare type Dict<T> = Record<string, T | undefined>;

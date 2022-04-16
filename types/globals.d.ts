
declare type ArrayElement<A> = A extends ReadonlyArray<infer T> ? T : never;

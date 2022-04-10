
export function classJoin(...classes: Array<string | null | undefined | false>) {
  return classes.filter(x => x).join(" ") || undefined;
}


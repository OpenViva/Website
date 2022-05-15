import { useMemo } from "react";
import useSSR from "./useSSR";

export default function useId() {
  const ssr = useSSR();
  const id = useMemo(() => Math.random().toString(16).slice(2), []);
  
  if(ssr) return undefined;
  else return id;
}

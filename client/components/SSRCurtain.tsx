import React from "react";
import useRSS from "../helpers/useRSS";

interface Props {
  children?: any;
}

export default function SSRCurtain({ children }: Props) {
  const rss = useRSS();
  
  if(rss) return null;
  else return children || null
}

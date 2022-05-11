import React from "react";

interface PlaceholdersProps {
  count: number;
}

export default function Placeholders({ count }: PlaceholdersProps) {
  return <>
    {new Array(count).fill(0).map((val, id) => <div key={id} className="placeholder" />)}
  </>; // eslint-disable-line react/jsx-closing-tag-location
}


import React from "react";

interface ParagraphProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Paragraph({ header, children }: ParagraphProps) {
  return <>
    <h3>{header}</h3>
    <p>{children}</p>
  </>; // eslint-disable-line react/jsx-closing-tag-location
}

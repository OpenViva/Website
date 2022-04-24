import React from "react";
import { classJoin } from "../helpers/utils";
import "./Segment.scss";

export interface SegmentProps extends React.ComponentProps<"div"> {}

export default function Segment({ className, ...rest }: SegmentProps) {
  return (
    <div className={classJoin("Segment", className)} {...rest} />
  );
}

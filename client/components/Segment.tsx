import React from "react";
import { classJoin } from "../helpers/utils";
import "./Segment.scss";

export interface SegmentProps extends React.ComponentProps<"div"> {
  compact?: boolean;
}

export default function Segment({ className, compact, ...rest }: SegmentProps) {
  return (
    <div className={classJoin("Segment", compact && "compact", className)} {...rest} />
  );
}

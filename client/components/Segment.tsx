import React from "react";
import { classJoin } from "../helpers/utils";
import "./Segment.scss";

export interface SegmentProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Segment({ className, children }: SegmentProps) {
  return (
    <div className={classJoin("Segment", className)}>
      {children}
    </div>
  );
}

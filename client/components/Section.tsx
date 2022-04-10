import React from "react";
import { classJoin } from "../helpers/utils";
import "./Section.scss";

export interface SectionProps {
  className?: string;
  full?: boolean;
  vertical?: boolean;
  centered?: boolean;
  children?: React.ReactNode;
}

export default function Section({ className, full, vertical, centered, children }: SectionProps) {
  return (
    <section className={classJoin("Section", full && "full", vertical && "vertical", centered && "centered", className)}>
      {children}
    </section>
  );
}

import React from "react";
import { classJoin } from "../helpers/utils";
import "./Section.scss";

export interface SectionProps {
  className?: string;
  full?: boolean;
  vertical?: boolean;
  children?: React.ReactNode;
}

export default function Section({ className, full, vertical, children }: SectionProps) {
  return (
    <section className={classJoin("Section", full && "full", vertical && "vertical", className)}>
      {children}
    </section>
  );
}

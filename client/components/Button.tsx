import React from "react";
import { classJoin } from "../helpers/utils";
import "./Button.scss";

export interface ButtonProps<As> {
  as?: As;
  className?: string;
  primary?: boolean;
  content?: React.ReactNode;
  label?: React.ReactNode;
}

export default function Button<As extends React.ElementType>({ as, className, primary, content, label, ...rest }: ButtonProps<As> & React.ComponentProps<As>) {
  const C: As | "div" = as || "div";
  
  return (
    <C className={classJoin("Button", className, primary && "primary")} {...rest}>
      {content}
      {label ? <label>{label}</label> : null}
    </C>
  );
}

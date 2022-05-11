import React from "react";
import { classJoin } from "../helpers/utils";
import "./Field.scss";

interface FieldProps<As> {
  as?: As;
  label?: string;
  fluid?: boolean;
  required?: boolean;
  className?: string;
}

export default function Field<As extends React.ElementType>({ as, label, fluid, required, className, children, ...rest }: FieldProps<As> & React.ComponentProps<As>) {
  const C: As | "input" = as || "input";
  if(!children) children = <C required={required} {...rest} />;
  
  return (
    <div className={classJoin("Field", fluid && "fluid", required && "required", className)}>
      <label className="label" htmlFor={rest.id}>{label}</label>
      {children}
    </div>
  );
}

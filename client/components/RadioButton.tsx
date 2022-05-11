import React from "react";
import { classJoin } from "../helpers/utils";
import "./RadioButton.scss";

interface RadioButtonProps {
  id?: string;
  name?: string;
  value: any;
  text: string;
  active?: boolean;
  type?: string;
  muted?: boolean;
  onChange?: React.ChangeEventHandler;
}

export default function RadioButton({ id, name, value, text, active, muted, type = "radio", onChange }: RadioButtonProps) {
  return (
    <div className={classJoin("RadioButton", !muted && active && "active")}>
      <input type={type} id={id} name={name} checked={active}
             value={value} onChange={onChange} />
      <label htmlFor={id}>{text}</label>
    </div>
  );
}

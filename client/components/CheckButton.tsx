import React, { useCallback, useEffect, useRef } from "react";
import { classJoin } from "../helpers/utils";
import useId from "../hooks/useId";
import "./CheckButton.scss";

interface CheckButtonProps extends Omit<React.ComponentProps<"input">, "onChange" | "checked"> {
  name?: string;
  text: string;
  checked?: boolean | null;
  radio?: boolean;
  muted?: boolean;
  triState?: boolean;
  onChange?: (value: boolean | null, ev: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckButton({ name, text, checked, muted, radio, onChange, triState, ...props }: CheckButtonProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const onInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    let newValue;
    if(checked === null) newValue = true;
    else if(checked === true) newValue = false;
    else if(triState) newValue = null;
    else newValue = true;
    
    if(onChange) onChange(newValue, ev);
  }, [onChange, triState, checked]);
  
  useEffect(() => {
    if(inputRef.current) inputRef.current.indeterminate = checked === null;
  }, [checked]);
  
  let textValue = "";
  if(checked === true) textValue = "true";
  if(checked === false) textValue = "false";
  
  return (
    <div className={classJoin("CheckButton", !muted && checked && "active")}>
      <input id={id} type={radio ? "radio" : "checkbox"} checked={!!checked} {...props} onChange={onInputChange} ref={inputRef} />
      <label htmlFor={id}>{text}</label>
      {name && <input name={name} value={textValue} readOnly type="hidden" />}
    </div>
  );
}

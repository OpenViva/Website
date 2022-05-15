import React, { useCallback, useState } from "react";
import CheckButton from "./CheckButton";

interface CheckButtonGroupItem {
  text: string;
  value: any;
  key?: any;
}

interface CheckButtonGroupProps {
  name?: string;
  radio?: boolean;
  defaultValue?: any;
  nullItem?: string;
  items: CheckButtonGroupItem[];
  onChange?: (value: any) => void;
}

export default function CheckButtonGroup({ name, radio, defaultValue, nullItem, items, onChange }: CheckButtonGroupProps) {
  const [value, setValue] = useState(defaultValue || (radio ? undefined : []));
  
  const onButtonChange = useCallback((_value, ev: React.ChangeEvent<HTMLInputElement>) => {
    const itemId = ev.currentTarget.dataset.itemid;
    const itemValue = items[parseInt(itemId || "0")].value;
    let newValue: any;
    
    if(radio) newValue = itemValue;
    else if(value.includes(itemValue)) newValue = value.filter((x: any) => x !== itemValue);
    else newValue = [...value, itemValue];
    
    setValue(newValue);
    if(onChange) onChange(newValue);
  }, [items, onChange, radio, value]);
  
  const onNullChange = useCallback(() => {
    let newValue: any;
    
    if(radio) newValue = undefined;
    else newValue = [];
    
    setValue(newValue);
    if(onChange) onChange(newValue);
  }, [onChange, radio]);
  
  let textValue;
  if(value === undefined) textValue = "";
  else if(typeof value !== "string") textValue = JSON.stringify(value);
  else textValue = value;
  
  return <>
    {nullItem && <CheckButton text={nullItem} radio={radio} onChange={onNullChange}
                              checked={radio ? value === undefined : !value || value.length === 0} />}
    {items.map((item, id) =>
      <CheckButton key={item.key || id} text={item.text} radio={radio}
                   data-itemid={id} onChange={onButtonChange}
                   checked={radio ? value === item.value : value.includes(item.value)} />,
    )}
    {name && <input name={name} value={textValue} readOnly type="hidden" />}
  </>; // eslint-disable-line react/jsx-closing-tag-location
}

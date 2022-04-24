import React, { useCallback, useState } from "react";
import { classJoin } from "../helpers/utils";
import Loader from "./Loader";
import "./Button.scss";

export interface ButtonProps<As> {
  as?: As;
  className?: string;
  primary?: boolean;
  label?: React.ReactNode;
  fluid?: boolean;
  loading?: boolean;
  onClick?: (ev: React.MouseEvent<React.ElementType<As>>) => any;
}

export default function Button<As extends React.ElementType>({ as, className, primary, children, label, fluid, loading: loadingProp, onClick, ...rest }: ButtonProps<As> & React.ComponentProps<As>) {
  const [loading, setLoading] = useState(false);
  const C: As | "button" = as || "button";
  const isLoading = loading || loadingProp;
  
  const onClickHandler = useCallback(async (ev: React.MouseEvent<any>) => {
    if(!onClick) return;
    
    const ret = onClick(ev);
    
    if(ret instanceof Promise) {
      try {
        setLoading(true);
        await ret;
      } finally {
        setLoading(false);
      }
    }
  }, [onClick]);
  
  return (
    <C className={classJoin("Button",
                            className,
                            primary && "primary",
                            isLoading && "loading",
                            fluid && "fluid",
       )}
       {...rest}
       onClick={onClickHandler}>
      <span>{children}</span>
      {label ? <label>{label}</label> : null}
      {isLoading && <Loader />}
    </C>
  );
}

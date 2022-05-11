import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Dropdown.scss";
import { classJoin } from "../helpers/utils";

interface DropdownProps {
  text?: string;
  children?: React.ReactNode;
}

export default function Dropdown({ children, text }: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  
  const onMouseDown = useCallback((ev: React.MouseEvent<HTMLElement>) => {
    ev.preventDefault();
    setOpen(open => !open);
  }, []);
  
  const onFocus = useCallback(() => setOpen(true), []);
  
  useEffect(() => {
    const onClick = (ev: Event) => {
      if(containerRef.current && !containerRef.current.contains(ev.target as HTMLElement)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("click", onClick);
    document.addEventListener("focus", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focus", onClick);
    };
  }, []);
  
  return (
    <div className="Dropdown" onFocus={onFocus} ref={containerRef}>
      <div className={classJoin("button", open && "open")} onMouseDown={onMouseDown} tabIndex={0}>
        {text}
      </div>
      {open &&
        <div className="menu">
          {children}
        </div>
      }
    </div>
  );
}

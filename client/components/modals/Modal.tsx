import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Segment from "../Segment";
import { classJoin } from "../../helpers/utils";
import "./Modal.scss";

const stopPropagation = (ev: React.SyntheticEvent) => ev.stopPropagation();

export interface ModalProps extends React.ComponentProps<"div"> {
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  trigger?: React.ReactElement;
  compact?: boolean;
  children?: React.ReactNode;
}

export default function Modal({ open, onOpen, onClose, trigger, className, compact, children, ...rest }: ModalProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  
  trigger = trigger && React.cloneElement(trigger, { onClick: onOpen });
  
  useEffect(() => {
    if(open && !container) {
      const container = document.createElement("div");
      document.documentElement.appendChild(container);
      setContainer(container);
    }
    if(!open && container) {
      container.remove();
      setContainer(null);
    }
  }, [open, container]);
  
  if(open && container) {
    const modal = (
      <div className={classJoin("Modal", compact && "compact", className)} onClick={onClose} {...rest}>
        <Segment onClick={stopPropagation}>
          {children}
        </Segment>
      </div>
    );
    
    const portal = ReactDOM.createPortal(modal, container);
    
    return <>
      {trigger}
      {portal}
    </>; // eslint-disable-line react/jsx-closing-tag-location
  } else {
    return trigger || null;
  }
}

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { classJoin } from "../helpers/utils";
import { useConfig } from "../hooks/usePageData";
import useMeasure from "../hooks/useMeasure";
import ExLink from "./ExLink";
import "./Layout.scss";

const MIN_WIDTH = 350;
const MIN_HEIGHT = 600;

interface LayoutProps {
  stickyFooter?: boolean;
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function Layout({ stickyFooter, children }: LayoutProps) {
  const [top, setTop] = useState(stickyFooter || false);
  const { rect, ref } = useMeasure();
  const compact = rect ? rect.width < 800 : false;
  const scale = rect ? Math.min(rect.width / MIN_WIDTH, rect.height / MIN_HEIGHT, 1.0) * 100 : 100;
  
  useEffect(() => {
    if(!stickyFooter) return;
    
    const check = () => {
      setTop(document.documentElement.scrollTop === 0);
    };
    
    check();
    document.addEventListener("scroll", check);
    return () => document.removeEventListener("scroll", check);
  }, [stickyFooter]);
  
  return (
    <div className={classJoin("Layout", compact && "compact")}
         ref={ref}
         style={{ fontSize: scale < 100 ? `${scale}%` : undefined }}>
      <Header compact={compact} />
      {children}
      <footer className={(top ? "sticky" : undefined)}>
        <div className="text">
          OpenViva is an Open Source project developed by OpenViva Community
        </div>
        <Link to="/privacy">Privacy Policy</Link>
      </footer>
    </div>
  );
}

function Header({ compact = false }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = useConfig();
  
  const toggleOpen = useCallback(() => setOpen(o => !o), []);
  
  const links1 = <>
    <NavLink to="/">About</NavLink>
    <NavLink to="/download">Download</NavLink>
    <NavLink to="/assets">Mods</NavLink>
  </>; // eslint-disable-line react/jsx-closing-tag-location
  
  const links2 = <>
    <NavLink to="/faq">FAQ</NavLink>
    <ExLink to="https://github.com/OpenViva">GitHub</ExLink>
    <ExLink to={config.discordInvite} className="discord">Discord</ExLink>
  </>; // eslint-disable-line react/jsx-closing-tag-location
  
  if(compact) {
    return (
      <header onClick={toggleOpen}>
        <Link to="/" className="logo">
          <img src="/static/openviva_small.png" alt="logo" width={64} height={64} />
        </Link>
        {links1}
        {links2}
        <img className="menuBtn" src="/static/menu.svg" alt="menu" width={64} height={64} />
        <div className="menu" ref={menuRef} style={{ maxHeight: open && menuRef.current?.scrollHeight || undefined }}>
          {links1}
          {links2}
        </div>
      </header>
    );
  } else {
    return (
      <header>
        <div className='half'>
          {links1}
        </div>
        <Link to="/" className="logo">
          <img src="/static/openviva_small.png" alt="logo" width={64} height={64} />
        </Link>
        <div className='half'>
          {links2}
        </div>
      </header>
    );
  }
}

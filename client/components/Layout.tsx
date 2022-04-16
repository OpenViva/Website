import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { classJoin } from "../helpers/utils";
import { useConfig } from "../hooks/usePageData";
import useMeasure from "../hooks/useMeasure";
import ExLink from "./ExLink";
import "./Layout.scss";

interface LayoutProps {
  className?: string;
  stickyFooter?: boolean;
  children?: React.ReactNode;
}

export default function Layout({ className, stickyFooter, children }: LayoutProps) {
  const config = useConfig();
  const [top, setTop] = useState(stickyFooter || false);
  const { rect, ref } = useMeasure();
  const compact = rect ? rect.width < 1024 : false;
  
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
    <div className={classJoin("Layout", compact && "compact")} ref={ref}>
      <header>
        <div className='half'>
          <NavLink to="/" exact>About</NavLink>
          <NavLink to="/download">Download</NavLink>
          <NavLink to="/mods">Mods & Cards</NavLink>
        </div>
        <Link to="/" className="logo">
          <img src="/static/openviva_small.png" alt="logo" width={64} height={64} />
        </Link>
        <div className='half'>
          <NavLink to="/faq">FAQ</NavLink>
          <ExLink to="https://github.com/OpenViva">GitHub</ExLink>
          <ExLink to={config.discordInvite} className="discord">Discord</ExLink>
        </div>
      </header>
      <div className={`content${className ? ` ${className}` : ""}`}>
        {children}
      </div>
      <footer className={(top ? "sticky" : undefined)}>
        OpenViva is an Open Source project developed by OpenViva Community
        <div className="links">
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}


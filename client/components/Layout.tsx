import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ExLink from "./ExLink";
import "./Layout.scss";

interface LayoutProps {
  className?: string;
  stickyFooter?: boolean;
  children: React.ReactNode;
}

export default function Layout({ className, stickyFooter, children }: LayoutProps) {
  const [top, setTop] = useState(stickyFooter || false);
  
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
    <div className="Layout">
      <header>
        <NavLink to="/#about" exact>About</NavLink>
        <NavLink to="/download">Download</NavLink>
        <NavLink to="/mods">Mods & Cards</NavLink>
        <Link to="/" className="logo">
          <img src="/static/openviva_small.png" alt="logo" width={64} height={64} />
        </Link>
        <NavLink to="/faq">FAQ</NavLink>
        <NavLink to="/docs">API Documentation</NavLink>
        <ExLink to="https://discord.gg/UEBGNbzv2p" className="discord">Discord</ExLink>
      </header>
      <div className={`content${className ? ` ${className}` : ""}`}>
        {children}
      </div>
      <Footer className={top ? " sticky" : ""} />
    </div>
  );
}

function Footer(props: React.ComponentProps<"footer">) {
  return (
    <footer {...props}>
      OpenViva is an Open Source project developed by OpenViva Community
      <div className="links">
        <ExLink to="https://github.com/OpenViva">GitHub</ExLink>
        <Link to="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
}

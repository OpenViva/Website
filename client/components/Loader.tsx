import React from "react";
import "./Loader.scss";

interface LoaderProps {
  size?: number;
}

export default function Loader({ size = 150 }) {
  return (
    <div className="Loader" style={{ fontSize: `${size}%` }}>
      <div />
      <div />
      <div />
    </div>
  );
}

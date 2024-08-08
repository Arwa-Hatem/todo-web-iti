import React from "react";
import "./Modal.css";

export default function Modal({ children }) {
  return (
    <div className="parent-of-Modal">
      <div className="Modal">
        <div>{children}</div>
      </div>
    </div>
  );
}

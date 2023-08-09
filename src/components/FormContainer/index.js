import React, { useState, useEffect } from "react";

import "./form_container.css";


function FormContainer({ children }) {

  const [headerHeight, setHeaderHeight ] = useState('0px');
  
  const resizeMarginTop = () => {
    setHeaderHeight(`${document.querySelector(".header").clientHeight}px`);
  };

  useEffect(()=>{
    try {
      setHeaderHeight(`${document.querySelector(".header").clientHeight}px`);
    } catch {
      setHeaderHeight('0px');
    }

    window.addEventListener("resize", resizeMarginTop);
    window.addEventListener("scroll", resizeMarginTop);
    window.addEventListener("render", resizeMarginTop);
    resizeMarginTop();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    return (() => {
      window.removeEventListener("resize", resizeMarginTop);
      window.removeEventListener("scroll", resizeMarginTop);
      window.removeEventListener("render", resizeMarginTop);
    });
  }, []);
  
  
  return (
    <div
      id="wrap-form-container"
      style={{ marginTop: headerHeight }}
    >
      {children}
    </div>
  );
}

export default FormContainer;

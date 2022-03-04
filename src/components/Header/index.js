import React, { useState, useEffect } from "react";
import "./header.css";

function Header() {
  const [headerId, setHeaderId] = useState('header-big');
  const [titleId, setTitleId] = useState('header-title-big');
  
  const shrinkOnScroll = () => {
    const shrinkOn = 16;
    //Now In the condition change the state to smaller so if the condition is true it will change to smaller otherwise to default state
    if (
      document.body.scrollTop > shrinkOn ||
      document.documentElement.scrollTop > shrinkOn
    ) {
      setHeaderId('header-smaller');
      setTitleId('header-title-smaller');
      return;
    } else if (
      document.body.scrollTop < shrinkOn - 2 ||
      document.documentElement.scrollTop < shrinkOn - 2
    ) {
      setHeaderId('header-big');
      setTitleId('header-title-big');
      return;
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", shrinkOnScroll);
  }, []);
  
  return (
    <header id={headerId} className="header">
      <h1 id={titleId}>Formularios de Supervision Redcom</h1>
    </header>
  );}

export default Header;

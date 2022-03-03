import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigator = useNavigate();
  useEffect(()=>{
    if (window.localStorage.getItem("logged") !== "true") {
      navigator('../login')
    }
  });

  return <></>;
}

export default Auth;
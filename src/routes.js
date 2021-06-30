import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Seller from "./pages/Seller";
import Survey from "./pages/Survey";
import Coaching from "./pages/Coaching";
import Continue from "./pages/Continue";
import End from "./pages/End";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Seller} path="/preventista" />
        <Route component={Survey} path="/relevamiento/:id" />
        <Route component={Coaching} path="/coaching/:id" />
        <Route component={Continue} path="/continuar" />
        <Route component={End} path="/fin" />
        <Route component={Home} exact path="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;

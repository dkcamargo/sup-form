import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Seller from "./pages/Seller";
import Survey from "./pages/Survey";
import Coaching from "./pages/Coaching";
import PreCoaching from "./pages/PreCoaching";
import PostCoaching from "./pages/PostCoaching";
import Continue from "./pages/Continue";
import Statistics from "./pages/Statistics";
import End from "./pages/End";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Seller} path="/preventista" />
        <Route component={Statistics} path="/estadisticas" />
        <Route component={Survey} path="/relevamiento" />
        <Route component={Coaching} path="/coaching" />
        <Route component={Continue} path="/continuar" />
        <Route component={PreCoaching} path="/pre-coaching" />
        <Route component={PostCoaching} path="/post-coaching" />
        <Route component={End} path="/fin" />
        <Route component={Home} exact path="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;

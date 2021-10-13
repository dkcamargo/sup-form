import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Coaching from "./pages/Coaching";
import PreCoaching from "./pages/PreCoaching";
import PostCoaching from "./pages/PostCoaching";
import Continue from "./pages/Continue";
import SurveyStatistics from "./pages/SurveyStatistics";
import CoachingStatistics from "./pages/CoachingStatistics";
import End from "./pages/End";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={SurveyStatistics} path="/relevamientos" />
        <Route component={CoachingStatistics} path="/coachings" />
        <Route component={Survey} path="/relevamiento" />
        <Route component={Coaching} path="/coaching" />
        <Route component={Continue} path="/continuar" />
        <Route component={PreCoaching} path="/pre-coaching" />
        <Route component={PostCoaching} path="/post-coaching" />
        <Route component={End} path="/fin" />
        <Route component={Login} exact path="/login" />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;

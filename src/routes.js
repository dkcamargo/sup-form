import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Coaching from "./pages/Coaching";
import PreCoaching from "./pages/PreCoaching";
import PostCoaching from "./pages/PostCoaching";
import Continue from "./pages/Continue";
import SurveyStatistics from "./pages/SurveyStatistics";
import CoachingStatistics from "./pages/CoachingStatistics";
import CoachingHistory from "./pages/CoachingHistory";
import CoachingView from "./pages/CoachingView";
import End from "./pages/End";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<CoachingStatistics />} exact path="/coachings" />
        <Route element={<CoachingHistory />} exact path="/coachings/:sucursal/:sellerId" />
        <Route element={<CoachingView />} exact path="/coachings/:sucursal/:sellerId/:coachingId" />
        <Route element={<SurveyStatistics />} path="/relevamientos" />
        <Route element={<Survey />} path="/relevamiento" />
        <Route element={<Coaching />} path="/coaching" />
        <Route element={<Continue />} path="/continuar" />
        <Route element={<PreCoaching />} path="/pre-coaching" />
        <Route element={<PostCoaching />} path="/post-coaching" />
        <Route element={<End />} path="/fin" />
        <Route element={<Login />} exact path="/login" />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

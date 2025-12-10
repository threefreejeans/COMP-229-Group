import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import SurveyForm from "./pages/surveyForm.jsx";
import Home from "./pages/home.jsx";
import Profile from "./pages/profile.jsx";

import NavBar from "./components/NavBar.jsx";

import "./styles/nav.css";
import "./styles/landing.css";
import "./styles/login.css";
import "./styles/surveyForm.css";
import "./styles/home.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Global navigation bar */}
      <NavBar />

      {/* Route views */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/survey" element={<SurveyForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

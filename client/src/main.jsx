// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login.jsx";
import SurveyForm from "./pages/surveyForm.jsx"; 

import "./styles/login.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/survey" element={<SurveyForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

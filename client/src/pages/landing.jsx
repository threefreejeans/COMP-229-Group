import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
// TODO: put your logo file at client/src/assets/logo.png or change this import
import logo from "../assets/logo.jpg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Landing = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Optional: show some “objects” on the landing page
    const fetchSurveys = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/surveys`);
        if (!res.ok) {
          // if protected or fails, just show no surveys instead of breaking
          setError("Unable to load surveys right now.");
          return;
        }
        const data = await res.json();
        setSurveys(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load surveys right now.");
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="landing-page">
      <header className="landing-hero">
        <div className="landing-left">
          <div className="landing-logo-wrap">
            <img src={logo} alt="Team Logo" className="landing-logo" />
            <span className="landing-team-name">Team ShoeStats</span>
          </div>
          <h1 className="landing-title">Shoe Survey Hub</h1>
          <p className="landing-subtitle">
            A survey application to track popular shoe brands and buying
            habits. Sign in or create an account to start participating.
          </p>

          <div className="landing-actions">
            <button
              className="landing-btn primary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="landing-btn secondary"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="landing-right">
          <div className="landing-card">
            <h2>About This Site</h2>
            <p>
              This web application allows users to submit surveys about shoe
              brands they’ve purchased and how many pairs they own for each
              brand. Administrators can review survey responses and user
              accounts.
            </p>
          </div>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-section">
          <div className="landing-section-header">
            <h2>Available Surveys</h2>
            <p>
              A list of surveys (objects) related to shoe brand preferences and
              purchase history.
            </p>
          </div>

          {error && <p className="landing-error">{error}</p>}

          {surveys.length === 0 && !error && (
            <p className="landing-empty">
              No surveys available yet. Sign in as an administrator to create
              one.
            </p>
          )}

          {surveys.length > 0 && (
            <ul className="landing-survey-list">
              {surveys.map((survey) => (
                <li key={survey._id} className="landing-survey-item">
                  <h3>{survey.title || "Untitled Survey"}</h3>
                  <p>{survey.description || "No description provided."}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Landing;

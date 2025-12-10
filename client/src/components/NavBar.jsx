import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/nav.css";
import logo from "../assets/logo.jpg"; // adjust if your logo path is different

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Load user from localStorage whenever route changes
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  const isLoggedIn = !!user;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <button className="nav-logo-area" onClick={() => navigate("/")}>
          <img src={logo} alt="Team Logo" className="nav-logo" />
          <div className="nav-site-text">
            <span className="nav-site-name">Shoe Survey Hub</span>
            <span className="nav-site-tagline">Team ShoeStats</span>
          </div>
        </button>
      </div>

      <div className="nav-center">
        {/* Always visible items */}
        <Link
          to="/"
          className={`nav-link ${isActive("/") ? "active" : ""}`}
        >
          Home
        </Link>

        {/* Only show survey/dashboard links when logged in */}
        {isLoggedIn && (
          <>
            <Link
              to="/home"
              className={`nav-link ${isActive("/home") ? "active" : ""}`}
            >
              Users
            </Link>
            <Link
              to="/survey"
              className={`nav-link ${isActive("/survey") ? "active" : ""}`}
            >
              Survey
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
            >
              My Profile
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className={`nav-link nav-cta ${
                isActive("/login") ? "active" : ""
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`nav-link nav-ghost ${
                isActive("/register") ? "active" : ""
              }`}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="nav-user-pill">
              {user.username || user.email || "User"}
            </span>
            <button className="nav-link nav-signout" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

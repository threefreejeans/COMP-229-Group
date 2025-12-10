import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // "user" or "admin"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
      // username/role NOT needed here; backend ignores them
    };

    try {
      const url = `${API_BASE_URL}/api/auth/login`;
      console.log("[LOGIN] Sending to:", url, "payload:", payload);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[LOGIN] Response status:", res.status);
      const data = await res.json().catch(() => null);
      console.log("[LOGIN] Response body:", data);

      if (!res.ok) {
        alert(
          (data && (data.message || data.error)) ||
          `Login failed (status ${res.status})`
        );
        return;
      }

      // data is: {_id, username, email, role, token}
      if (!data || !data.token) {
        alert("Login succeeded but response format was unexpected.");
        return;
      }

      // Build a user object to store
      const userObj = {
        _id: data._id,
        username: data.username,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userObj));

      // Decide where to go based on role
      if (data.role === "admin") {
        navigate("/home");
      } else {
        navigate("/survey");
      }
    } catch (err) {
      console.error("[LOGIN] Network or code error:", err);
      alert("Something went wrong during login (check console).");
    }
  };


  return (
    <div className="login-page">
      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <div className="login-row">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-row">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-row">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-role-row">
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === "user"}
                onChange={() => handleRoleChange("user")}
              />
              <span>User</span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={() => handleRoleChange("admin")}
              />
              <span>Administrator</span>
            </label>
          </div>

          <div className="login-submit-row">
            <button type="submit" className="login-submit">
              Login
            </button>
          </div>
        </form>
        <p className="login-footer-text">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="login-link-button"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;

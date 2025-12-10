import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // reuse login styling

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(
          (data && (data.message || data.error)) ||
            `Registration failed (status ${res.status})`
        );
        return;
      }

      alert("Registration successful! You can now sign in.");
      navigate("/login");
    } catch (err) {
      console.error("[REGISTER] Error:", err);
      alert("Something went wrong during registration.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Create an Account</h1>
        <p className="login-subtitle">
          Fill in your details to sign up for Shoe Survey Hub.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-field">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button type="submit" className="login-button">
            Sign Up
          </button>

          <p className="login-footer-text">
            Already have an account?{" "}
            <button
              type="button"
              className="login-link-button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

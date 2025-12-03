import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


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

const handleSubmit = (e) => {
  e.preventDefault();
  // TODO: add your API call if needed

  navigate("/survey"); // redirect to surveyForm.jsx
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
      </div>
    </div>
  );
};

export default Login;

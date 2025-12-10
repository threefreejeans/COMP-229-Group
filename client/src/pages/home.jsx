import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [newSurvey, setNewSurvey] = useState({
    title: "",
    description: "",
    isActive: true,
  });

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, surveysRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users`, { headers }),
          fetch(`${API_BASE_URL}/api/surveys`, { headers }),
        ]);

        if (!usersRes.ok || !surveysRes.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const usersData = await usersRes.json();
        const surveysData = await surveysRes.json();

        setUsers(usersData);
        setSurveys(surveysData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const ensureAdmin = () => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("Only administrators can perform this action.");
      return false;
    }
    return true;
  };

  /* ====================== USER CRUD ====================== */

  const handleUserDelete = async (id) => {
    if (!ensureAdmin()) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(
          (data && (data.message || data.error)) ||
            `Failed to delete user (status ${res.status})`
        );
        return;
      }

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  };

  const handleUserEditClick = (user) => {
    if (!ensureAdmin()) return;
    setEditingUser({
      _id: user._id,
      username: user.username || "",
      email: user.email || "",
      role: user.role || "user",
    });
  };

  const handleUserEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserEditSubmit = async (e) => {
    e.preventDefault();
    if (!ensureAdmin()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editingUser.username,
          email: editingUser.email,
          role: editingUser.role,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(
          (data && (data.message || data.error)) ||
            `Failed to update user (status ${res.status})`
        );
        return;
      }

      // Update local list
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingUser._id ? { ...u, ...data } : u
        )
      );
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Error updating user.");
    }
  };

  /* ====================== SURVEY CRUD ====================== */

  const handleNewSurveyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSurvey((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    if (!ensureAdmin()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSurvey),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(
          (data && (data.message || data.error)) ||
            `Failed to create survey (status ${res.status})`
        );
        return;
      }

      setSurveys((prev) => [...prev, data]);
      setNewSurvey({ title: "", description: "", isActive: true });
    } catch (err) {
      console.error(err);
      alert("Error creating survey.");
    }
  };

  const handleSurveyEditClick = (survey) => {
    if (!ensureAdmin()) return;
    setEditingSurvey({
      _id: survey._id,
      title: survey.title || "",
      description: survey.description || "",
      isActive:
        typeof survey.isActive === "boolean" ? survey.isActive : true,
    });
  };

  const handleSurveyEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingSurvey((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSurveyEditSubmit = async (e) => {
    e.preventDefault();
    if (!ensureAdmin()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/api/surveys/${editingSurvey._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editingSurvey.title,
            description: editingSurvey.description,
            isActive: editingSurvey.isActive,
          }),
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(
          (data && (data.message || data.error)) ||
            `Failed to update survey (status ${res.status})`
        );
        return;
      }

      setSurveys((prev) =>
        prev.map((s) =>
          s._id === editingSurvey._id ? { ...s, ...data } : s
        )
      );
      setEditingSurvey(null);
    } catch (err) {
      console.error(err);
      alert("Error updating survey.");
    }
  };

  const handleSurveyDelete = async (id) => {
    if (!ensureAdmin()) return;
    if (!window.confirm("Are you sure you want to delete this survey?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/surveys/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(
          (data && (data.message || data.error)) ||
            `Failed to delete survey (status ${res.status})`
        );
        return;
      }

      setSurveys((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting survey.");
    }
  };

  /* ====================== RENDER ====================== */

  if (loading) {
    return (
      <div className="home-page">
        <div className="home-card">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="home-card home-error">
          <h2>Dashboard Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-card">
        <header className="home-header">
          <div>
            <h1 className="home-title">Admin Dashboard</h1>
            <p className="home-subtitle">
              Manage users and surveys for Shoe Survey Hub.
            </p>
          </div>
          <div className="home-header-right">
            {currentUser && (
              <div className="home-user-info">
                <span className="home-user-name">
                  {currentUser.username || currentUser.email || "User"}
                </span>
                <span className="home-user-role">
                  {currentUser.role || "user"}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* ===== USERS SECTION ===== */}
        <section className="home-section">
          <div className="home-section-header">
            <h2>Users</h2>
            <span className="home-badge">{users.length}</span>
          </div>

          {users.length === 0 ? (
            <p className="home-empty-text">No users found.</p>
          ) : (
            <ul className="home-list">
              {users.map((user) => (
                <li key={user._id} className="home-item">
                  <div className="home-item-main">
                    <h3>{user.username || user.email || "Unnamed User"}</h3>
                    <p className="home-item-secondary">
                      {user.email || "No email provided"}
                    </p>
                  </div>
                  <div className="home-item-meta">
                    <span className="home-pill">
                      {user.role || "user"}
                    </span>
                    <div className="home-actions">
                      <button
                        className="home-button small"
                        onClick={() => handleUserEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="home-button danger small"
                        onClick={() => handleUserDelete(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Edit User Form */}
          {editingUser && (
            <form
              className="home-edit-form"
              onSubmit={handleUserEditSubmit}
            >
              <h3>Edit User</h3>
              <div className="home-edit-grid">
                <label>
                  Username
                  <input
                    type="text"
                    name="username"
                    value={editingUser.username}
                    onChange={handleUserEditChange}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleUserEditChange}
                    required
                  />
                </label>
                <label>
                  Role
                  <select
                    name="role"
                    value={editingUser.role}
                    onChange={handleUserEditChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </label>
              </div>
              <div className="home-edit-actions">
                <button type="submit" className="home-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="home-button secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ===== SURVEYS SECTION ===== */}
        <section className="home-section">
          <div className="home-section-header">
            <h2>Surveys</h2>
            <span className="home-badge">{surveys.length}</span>
          </div>

          {surveys.length === 0 ? (
            <p className="home-empty-text">No surveys found.</p>
          ) : (
            <ul className="home-list">
              {surveys.map((survey) => (
                <li key={survey._id} className="home-item">
                  <div className="home-item-main">
                    <h3>{survey.title || "Untitled Survey"}</h3>
                    <p className="home-item-secondary">
                      {survey.description || "No description"}
                    </p>
                  </div>
                  <div className="home-item-meta">
                    <span className="home-pill">
                      {survey.isActive ? "Active" : "Inactive"}
                    </span>
                    <div className="home-actions">
                      <button
                        className="home-button small"
                        onClick={() => handleSurveyEditClick(survey)}
                      >
                        Edit
                      </button>
                      <button
                        className="home-button danger small"
                        onClick={() => handleSurveyDelete(survey._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Create Survey Form */}
          <form className="home-edit-form" onSubmit={handleCreateSurvey}>
            <h3>Create New Survey</h3>
            <div className="home-edit-grid">
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={newSurvey.title}
                  onChange={handleNewSurveyChange}
                  required
                />
              </label>
              <label>
                Description
                <input
                  type="text"
                  name="description"
                  value={newSurvey.description}
                  onChange={handleNewSurveyChange}
                />
              </label>
              <label className="home-checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newSurvey.isActive}
                  onChange={handleNewSurveyChange}
                />
                Active
              </label>
            </div>
            <div className="home-edit-actions">
              <button type="submit" className="home-button">
                Create Survey
              </button>
            </div>
          </form>

          {/* Edit Survey Form */}
          {editingSurvey && (
            <form
              className="home-edit-form"
              onSubmit={handleSurveyEditSubmit}
            >
              <h3>Edit Survey</h3>
              <div className="home-edit-grid">
                <label>
                  Title
                  <input
                    type="text"
                    name="title"
                    value={editingSurvey.title}
                    onChange={handleSurveyEditChange}
                    required
                  />
                </label>
                <label>
                  Description
                  <input
                    type="text"
                    name="description"
                    value={editingSurvey.description}
                    onChange={handleSurveyEditChange}
                  />
                </label>
                <label className="home-checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editingSurvey.isActive}
                    onChange={handleSurveyEditChange}
                  />
                  Active
                </label>
              </div>
              <div className="home-edit-actions">
                <button type="submit" className="home-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="home-button secondary"
                  onClick={() => setEditingSurvey(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;

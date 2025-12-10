import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css"; // reuse styling or create profile.css

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(
            (data && (data.message || data.error)) ||
              `Failed to load profile (status ${res.status})`
          );
          return;
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong loading your profile.");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
    return (
      <div className="home-page">
        <div className="home-card home-error">
          <h2>My Profile</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="home-page">
        <div className="home-card">
          <p>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-card">
        <h1 className="home-title">My Profile</h1>
        <p className="home-subtitle">
          View your account details for Shoe Survey Hub.
        </p>

        <div className="home-section" style={{ marginTop: "16px" }}>
          <ul className="home-list">
            <li className="home-item">
              <div className="home-item-main">
                <h3>Username</h3>
                <p className="home-item-secondary">
                  {profile.username || "N/A"}
                </p>
              </div>
            </li>

            <li className="home-item">
              <div className="home-item-main">
                <h3>Email</h3>
                <p className="home-item-secondary">{profile.email || "N/A"}</p>
              </div>
            </li>

            <li className="home-item">
              <div className="home-item-main">
                <h3>Role</h3>
                <p className="home-item-secondary">{profile.role || "user"}</p>
              </div>
            </li>

            {profile.createdAt && (
              <li className="home-item">
                <div className="home-item-main">
                  <h3>Member Since</h3>
                  <p className="home-item-secondary">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;

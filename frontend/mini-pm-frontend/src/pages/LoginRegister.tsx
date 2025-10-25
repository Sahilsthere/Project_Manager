import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";

const LoginRegister: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await api.post("/api/auth/register", { username, password });
        setIsRegister(false);
      } else {
        const res = await api.post("/api/auth/login", { username, password });
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err: any) {
      setError(err?.response?.data || err.message || "Error");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            minLength={3}
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
          />
          {error && <div className="error-msg">{error}</div>}
          <button className="submit-btn" type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <button
          className="toggle-btn"
          onClick={() => setIsRegister((s) => !s)}
        >
          {isRegister ? "Have account? Login" : "No account? Register"}
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;

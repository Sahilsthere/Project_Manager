import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input id="username" name="username" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required minLength={3} />
        </div>
        <div>
          <input id="password" name="password" autoComplete="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <button onClick={() => setIsRegister(s => !s)} style={{ marginTop: 8 }}>
        {isRegister ? "Have account? Login" : "No account? Register"}
      </button>
    </div>
  );
};

export default LoginRegister;

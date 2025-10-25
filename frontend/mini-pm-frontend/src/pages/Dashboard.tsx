import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Project } from "../types";
import { useNavigate, Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await api.get<Project[]>("/api/projects");
      setProjects(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else setError("Failed to load projects");
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 3) {
      setError("Title too short");
      return;
    }
    try {
      await api.post("/api/projects", { title, description: desc });
      setTitle(""); setDesc("");
      fetchProjects();
    } catch {
      setError("Failed to create");
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete project?")) return;
    await api.delete(`/api/projects/${id}`);
    setProjects(p => p.filter(x => x.id !== id));
  };

  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  return (
    <div style={{ padding: 20 }}>
      <h1>Projects</h1>
      <button onClick={logout}>Logout</button>
      <form onSubmit={createProject}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title" required minLength={3} />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
        <button type="submit">Create</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <Link to={`/projects/${p.id}`}>{p.title}</Link>
            <button onClick={() => deleteProject(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

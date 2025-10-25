import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Project } from "../types";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css"; // New CSS file

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 3) {
      setError("Title too short");
      return;
    }
    try {
      await api.post("/api/projects", { title, description: desc });
      setTitle("");
      setDesc("");
      fetchProjects();
    } catch {
      setError("Failed to create project");
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete project?")) return;
    await api.delete(`/api/projects/${id}`);
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Projects</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <form className="project-form" onSubmit={createProject}>
        <input
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          required
          minLength={3}
        />
        <input
          className="input-field"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
        />
        <button className="create-btn" type="submit">
          Create
        </button>
      </form>

      {error && <div className="error-msg">{error}</div>}

      <ul className="projects-list">
        {projects.map((p) => (
          <li key={p.id} className="project-item">
            <Link className="project-link" to={`/projects/${p.id}`}>
              {p.title}
            </Link>
            <button
              className="delete-btn"
              onClick={() => deleteProject(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Task } from "../types";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectDetails.css"; 

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState<string>("");
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      const res = await api.get(`/api/projects/${id}`);
      const data = res.data;
      setProjectTitle(data.title);
      setProjectDesc(data.description || "");
      setTasks(data.tasks || []);
    } catch (err: any) {
      if (err.response?.status === 404) {
        alert("Project not found");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/api/projects/${id}/tasks`, {
      title: taskTitle,
      dueDate: taskDue || null,
    });
    setTaskTitle("");
    setTaskDue("");
    fetch();
  };

  const toggle = async (t: Task) => {
    await api.put(`/api/tasks/${t.id}`, {
      title: t.title,
      dueDate: t.dueDate,
      isCompleted: !t.isCompleted,
    });
    fetch();
  };

  const remove = async (t: Task) => {
    if (!confirm("Delete task?")) return;
    await api.delete(`/api/tasks/${t.id}`);
    fetch();
  };

  return (
    <div className="project-details-container">
      <h2 className="project-title">{projectTitle}</h2>
      <p className="project-desc">{projectDesc}</p>

      <form className="task-form" onSubmit={addTask}>
        <input
          className="input-field"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <input
          className="input-field"
          type="date"
          value={taskDue}
          onChange={(e) => setTaskDue(e.target.value)}
        />
        <button className="add-btn" type="submit">
          Add Task
        </button>
      </form>

      <ul className="tasks-list">
        {tasks.map((t: any) => (
          <li key={t.id} className="task-item">
            <label>
              <input
                type="checkbox"
                checked={t.isCompleted}
                onChange={() => toggle(t)}
              />
              <span className={t.isCompleted ? "completed" : ""}>
                {t.title}{" "}
                {t.dueDate
                  ? `- due ${new Date(t.dueDate).toLocaleDateString()}`
                  : ""}
              </span>
            </label>
            <button className="delete-btn" onClick={() => remove(t)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetails;

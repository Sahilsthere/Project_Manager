import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Task } from "../types";
import { useParams, useNavigate } from "react-router-dom";

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

  useEffect(() => { fetch(); }, [id]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/api/projects/${id}/tasks`, { title: taskTitle, dueDate: taskDue || null });
    setTaskTitle(""); setTaskDue("");
    fetch();
  };

  const toggle = async (t: Task) => {
    await api.put(`/api/tasks/${t.id}`, { title: t.title, dueDate: t.dueDate, isCompleted: !t.isCompleted });
    fetch();
  };

  const remove = async (t: Task) => {
    if (!confirm("Delete task?")) return;
    await api.delete(`/api/tasks/${t.id}`);
    fetch();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{projectTitle}</h2>
      <p>{projectDesc}</p>
      <form onSubmit={addTask}>
        <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task title" required />
        <input type="date" value={taskDue} onChange={e => setTaskDue(e.target.value)} />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((t: any) => (
          <li key={t.id}>
            <input type="checkbox" checked={t.isCompleted} onChange={() => toggle(t)} />
            {t.title} {t.dueDate ? `- due ${new Date(t.dueDate).toLocaleDateString()}` : ""}
            <button onClick={() => remove(t)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetails;

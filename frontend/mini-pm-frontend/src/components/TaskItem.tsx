import React from "react";
import "./TaskItem.css";

interface TaskItemProps {
  title: string;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  completed = false,
  onToggle,
  onDelete,
}) => {
  return (
    <div className={`task-item ${completed ? "completed" : ""}`}>
      <label>
        <input type="checkbox" checked={completed} onChange={onToggle} />
        <span className="task-title">{title}</span>
      </label>
      {onDelete && (
        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

export default TaskItem;

import React from "react";
import "./ProjectCard.css";

interface ProjectCardProps {
  title: string;
  description: string;
  status?: "Active" | "Completed" | "Pending";
  onView?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  status = "Active",
  onView,
}) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3>{title}</h3>
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </div>
      <p className="project-card-description">{description}</p>
      {onView && (
        <div className="project-card-footer">
          <button className="view-btn" onClick={onView}>
            View
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;

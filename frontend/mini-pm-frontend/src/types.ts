// src/types.d.ts
export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string | null;
  isCompleted: boolean;
  projectId: number;
}

// Task entity for API responses (with id)
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface CreateTaskRequest {
  title: string;
}

// Task entity for updates
export interface UpdateTaskRequest {
  title: string;
  completed: boolean;
}

import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

interface ApiResponse<T = unknown> {
  estado: string;
  message: string;
  data: T;
}

// Type guard to validate Task structure
function isTask(obj: unknown): obj is Task {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "title" in obj &&
    "completed" in obj &&
    typeof (obj as Record<string, unknown>).id === "number" &&
    typeof (obj as Record<string, unknown>).title === "string" &&
    typeof (obj as Record<string, unknown>).completed === "boolean"
  );
}

// Type guard to validate Task array
function isTaskArray(obj: unknown): obj is Task[] {
  return Array.isArray(obj) && obj.every(isTask);
}

export class TaskApiRepository implements TaskRepository {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (data.estado === "error") {
      throw new Error(data.message);
    }

    return data.data;
  }

  async getAll(): Promise<Task[]> {
    const data = await this.makeRequest<unknown>("/tasks");
    if (!isTaskArray(data)) {
      throw new Error("Invalid response format: expected Task array");
    }
    return data;
  }

  async getById(id: number): Promise<Task> {
    const data = await this.makeRequest<unknown>(`/tasks/${id}`);
    if (!isTask(data)) {
      throw new Error("Invalid response format: expected Task");
    }
    return data;
  }

  async create(title: string): Promise<Task> {
    const createRequest: CreateTaskRequest = { title };
    const data = await this.makeRequest<unknown>("/tasks", {
      method: "POST",
      body: JSON.stringify(createRequest),
    });
    if (!isTask(data)) {
      throw new Error("Invalid response format: expected Task");
    }
    return data;
  }

  async update(id: number, task: UpdateTaskRequest): Promise<Task> {
    const data = await this.makeRequest<unknown>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
    if (!isTask(data)) {
      throw new Error("Invalid response format: expected Task");
    }
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.makeRequest<unknown>(`/tasks/${id}/complete`, {
      method: "DELETE",
    });
  }

  async markComplete(id: number): Promise<Task> {
    const data = await this.makeRequest<unknown>(`/tasks/${id}/complete`, {
      method: "PATCH",
    });
    if (!isTask(data)) {
      throw new Error("Invalid response format: expected Task");
    }
    return data;
  }
}

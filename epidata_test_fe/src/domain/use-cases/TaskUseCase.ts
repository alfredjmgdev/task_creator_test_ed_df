import { Task, UpdateTaskRequest } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskUseCase {
  constructor(private repo: TaskRepository) {}

  async getAllTasks(): Promise<Task[]> {
    return this.repo.getAll();
  }

  async getTaskById(taskId: number): Promise<Task> {
    return this.repo.getById(taskId);
  }

  async createTask(title: string): Promise<Task> {
    if (!title.trim()) {
      throw new Error("Task title cannot be empty");
    }
    return this.repo.create(title);
  }

  async updateTask(taskId: number, task: UpdateTaskRequest): Promise<Task> {
    if (!task.title.trim()) {
      throw new Error("Task title cannot be empty");
    }
    return this.repo.update(taskId, task);
  }

  async markTaskComplete(taskId: number): Promise<Task> {
    return this.repo.markComplete(taskId);
  }

  async deleteTask(taskId: number): Promise<void> {
    return this.repo.delete(taskId);
  }
}

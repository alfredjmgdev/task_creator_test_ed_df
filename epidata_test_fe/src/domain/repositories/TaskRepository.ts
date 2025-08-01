import { Task, CreateTaskRequest, UpdateTaskRequest } from "../entities/Task";

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: number): Promise<Task>;
  create(title: string): Promise<Task>;
  update(id: number, task: UpdateTaskRequest): Promise<Task>;
  delete(id: number): Promise<void>;
  markComplete(id: number): Promise<Task>;
}

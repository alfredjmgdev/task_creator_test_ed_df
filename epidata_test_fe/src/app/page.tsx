"use client";

import React, { useState, useEffect } from "react";
import {
  TaskProvider,
  useTaskContext,
} from "../presentation/contexts/TaskContext";
import { useTaskOperations } from "../presentation/hooks/useTaskOperations";
import { CreateTaskForm } from "../presentation/components/CreateTaskForm";
import { TaskList } from "../presentation/components/TaskList";
import { TaskDetail } from "../presentation/components/TaskDetail";
import { ErrorDisplay } from "../presentation/components/ErrorDisplay";
import { Task } from "../domain/entities/Task";

function TaskApp() {
  const { state } = useTaskContext();
  const { loadTasks } = useTaskOperations();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Task Manager
            </h1>
            <p className="text-gray-600">Manage your tasks with ease</p>
          </div>

          <ErrorDisplay />

          <CreateTaskForm />

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Tasks
            </h2>
            <TaskList onTaskClick={handleTaskClick} onEdit={handleEdit} />
          </div>

          {state.loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={handleCloseDetail} />
      )}

      {editingTask && (
        <TaskDetail
          task={editingTask}
          onClose={handleCloseEdit}
          startInEditMode={true}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <TaskProvider>
      <TaskApp />
    </TaskProvider>
  );
}

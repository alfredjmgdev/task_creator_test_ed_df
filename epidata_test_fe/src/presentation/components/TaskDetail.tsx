"use client";

import React, { useState, useEffect } from "react";
import { Task, UpdateTaskRequest } from "../../domain/entities/Task";
import { useTaskOperations } from "../hooks/useTaskOperations";

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  startInEditMode?: boolean;
}

export function TaskDetail({
  task,
  onClose,
  startInEditMode = false,
}: TaskDetailProps) {
  const { updateTask, getTaskById } = useTaskOperations();
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const [isEditing, setIsEditing] = useState(startInEditMode);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCompleted, setEditCompleted] = useState(task.completed);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const freshTask = await getTaskById(task.id!);
        setCurrentTask(freshTask);
        setEditTitle(freshTask.title);
        setEditCompleted(freshTask.completed);
      } catch (error) {
        console.error("Failed to fetch task data:", error);
        setCurrentTask(task);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [task.id, getTaskById]);

  const handleUpdate = async () => {
    try {
      const updateRequest: UpdateTaskRequest = {
        title: editTitle,
        completed: editCompleted,
      };
      const updatedTask = await updateTask(task.id!, updateRequest);
      setCurrentTask(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleCancel = () => {
    setEditTitle(currentTask.title);
    setEditCompleted(currentTask.completed);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Loading task details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Task" : "Task Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter task title"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={editCompleted}
                onChange={(e) => setEditCompleted(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="completed"
                className="ml-2 block text-sm text-gray-900"
              >
                Completed
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID
              </label>
              <p className="text-gray-900">{currentTask.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <p
                className={`text-gray-900 ${
                  currentTask.completed ? "line-through" : ""
                }`}
              >
                {currentTask.title}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentTask.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentTask.completed ? "Completed" : "Pending"}
              </span>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

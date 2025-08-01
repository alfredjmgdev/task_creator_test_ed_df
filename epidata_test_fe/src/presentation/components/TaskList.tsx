"use client";

import React, { useState } from "react";
import { Task } from "../../domain/entities/Task";
import { useTaskOperations } from "../hooks/useTaskOperations";
import { useTaskContext } from "../contexts/TaskContext";

interface TaskListProps {
  onTaskClick: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export function TaskList({ onTaskClick, onEdit }: TaskListProps) {
  const { state } = useTaskContext();
  const { deleteTask, markTaskComplete } = useTaskOperations();
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);
  const [confirmingComplete, setConfirmingComplete] = useState<number | null>(
    null
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setConfirmingDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleMarkComplete = async (id: number) => {
    try {
      await markTaskComplete(id);
      setConfirmingComplete(null);
    } catch (error) {
      console.error("Failed to mark task as complete:", error);
    }
  };

  const handleEdit = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    onEdit(task);
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (state.tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks found. Create your first task above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state.tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
            task.completed
              ? "bg-green-50 border-green-200"
              : "bg-white border-gray-200"
          }`}
          onClick={() => onTaskClick(task)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3
                className={`font-medium ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              <p className="text-sm text-gray-500">
                ID: {task.id} • {task.completed ? "Completed" : "Pending"}
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={(e) => handleEdit(e, task)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>

              {confirmingDelete === task.id ? (
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id!);
                    }}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmingDelete(null);
                    }}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmingDelete(task.id!);
                  }}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}

              {confirmingComplete === task.id ? (
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkComplete(task.id!);
                    }}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmingComplete(null);
                    }}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmingComplete(task.id!);
                  }}
                  className={`px-3 py-1 text-xs rounded ${
                    task.completed
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {task.completed ? "Completed" : "Complete"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

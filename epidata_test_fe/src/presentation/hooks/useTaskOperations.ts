"use client";

import { useCallback } from "react";
import { useTaskContext } from "../contexts/TaskContext";
import { UpdateTaskRequest } from "../../domain/entities/Task";

export function useTaskOperations() {
  const { taskUseCase, dispatch } = useTaskContext();

  const loadTasks = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      const tasks = await taskUseCase.getAllTasks();
      dispatch({ type: "SET_TASKS", payload: tasks });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to load tasks",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [taskUseCase, dispatch]);

  const createTask = useCallback(
    async (title: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        const newTask = await taskUseCase.createTask(title);
        dispatch({ type: "ADD_TASK", payload: newTask });
        return newTask;
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to create task",
        });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [taskUseCase, dispatch]
  );

  const updateTask = useCallback(
    async (id: number, task: UpdateTaskRequest) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        const updatedTask = await taskUseCase.updateTask(id, task);
        dispatch({ type: "UPDATE_TASK", payload: updatedTask });
        return updatedTask;
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to update task",
        });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [taskUseCase, dispatch]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        await taskUseCase.deleteTask(id);
        dispatch({ type: "DELETE_TASK", payload: id });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to delete task",
        });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [taskUseCase, dispatch]
  );

  const markTaskComplete = useCallback(
    async (id: number) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        const updatedTask = await taskUseCase.markTaskComplete(id);
        dispatch({ type: "UPDATE_TASK", payload: updatedTask });
        return updatedTask;
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error
              ? error.message
              : "Failed to mark task as complete",
        });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [taskUseCase, dispatch]
  );

  const getTaskById = useCallback(
    async (id: number) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        const task = await taskUseCase.getTaskById(id);
        dispatch({ type: "SET_SELECTED_TASK", payload: task });
        return task;
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to get task",
        });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [taskUseCase, dispatch]
  );

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, [dispatch]);

  return {
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    markTaskComplete,
    getTaskById,
    clearError,
  };
}

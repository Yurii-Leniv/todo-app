"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Task, TaskOrder, TaskStatus } from "@/lib/api";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import SearchBar from "./SearchBar";
import FilterButtons from "./FilterButtons";
import SortButtons from "./SortButtons";

// Must match the transition duration of .animate-task-out in globals.css,
// otherwise the task would leave state before the animation finishes.
const REMOVE_ANIMATION_MS = 200;

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus>("all");
  const [order, setOrder] = useState<TaskOrder | null>(null);

  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      try {
        setTasks(await api.listTasks({ search, status, order }));
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [search, status, order]);

  async function handleCreate(title: string, priority: number) {
    const task = await api.createTask(title, priority);
    setTasks((prev) => [...prev, task]);
  }

  async function handleToggleDone(task: Task) {
    setPendingIds((prev) => new Set(prev).add(task.id));
    try {
      const updated = await api.updateTask(task.id, { done: !task.done });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch {
      setError("Failed to update task");
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`))
      return;

    setRemovingIds((prev) => new Set(prev).add(task.id));
    setTimeout(async () => {
      try {
        await api.deleteTask(task.id);
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
      } catch {
        setError("Failed to delete task");
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
      }
    }, REMOVE_ANIMATION_MS);
  }

  async function handleClearCompleted() {
    if (!window.confirm("Delete all completed tasks? This cannot be undone."))
      return;
    try {
      await api.deleteCompletedTasks();
      setTasks((prev) => prev.filter((t) => !t.done));
    } catch {
      setError("Failed to delete completed tasks");
    }
  }

  const hasCompleted = tasks.some((task) => task.done);

  return (
    <div className="mx-auto max-w-2xl">
      <TaskForm onCreate={handleCreate} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar onSearch={setSearch} />
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <FilterButtons value={status} onChange={setStatus} />
          <SortButtons value={order} onChange={setOrder} />
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm font-medium text-red-600">{error}</p>
      )}

      {hasCompleted && (
        <div className="mb-3 flex justify-end">
          <button
            onClick={handleClearCompleted}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
          >
            Clear completed
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white/50 px-5 py-10 text-center text-sm text-gray-500">
          No tasks found.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              pending={pendingIds.has(task.id)}
              removing={removingIds.has(task.id)}
              onToggleDone={handleToggleDone}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

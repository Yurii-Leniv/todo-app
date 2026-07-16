"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Task } from "@/lib/api";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listTasks()
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(title: string, priority: number) {
    const task = await api.createTask(title, priority);
    setTasks((prev) => [...prev, task]);
  }

  async function handleToggleDone(task: Task) {
    const updated = await api.updateTask(task.id, { done: !task.done });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  }

  async function handleDelete(task: Task) {
    await api.deleteTask(task.id);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  if (loading) return <p className="text-gray-500">Loading tasks...</p>;

  return (
    <div className="mx-auto max-w-xl">
      <TaskForm onCreate={handleCreate} />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleDone={handleToggleDone}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

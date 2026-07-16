const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Загальна обгортка над fetch: сама додає базовий URL, JSON-заголовки і,
// якщо є токен, Authorization: Bearer <token>. Усі запити до бекенда
// (і auth, і tasks) мають йти через неї, а не через голий fetch.
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.detail ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export type User = {
  id: number;
  email: string;
  created_at: string;
};

export type Task = {
  id: number;
  title: string;
  done: boolean;
  priority: number;
};

type AuthResponse = {
  access_token: string;
  token_type: string;
};

export function signup(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  return apiFetch<User>("/auth/me");
}

export function listTasks() {
  return apiFetch<Task[]>("/tasks");
}

export function createTask(title: string, priority: number) {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, priority }),
  });
}

export function updateTask(id: number, changes: Partial<Pick<Task, "title" | "done" | "priority">>) {
  return apiFetch<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteTask(id: number) {
  return apiFetch<void>(`/tasks/${id}`, { method: "DELETE" });
}

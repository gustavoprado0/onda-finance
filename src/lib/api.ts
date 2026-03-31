import axios from "axios";
import type { Transaction } from "../services/transactions";

export const api = axios.create({ baseURL: "/api" });

const db: Record<string, Transaction[]> = {};

function loadFromStorage() {
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("transactions_")
    );
    keys.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw) db[key] = JSON.parse(raw);
    });
  } catch {}
}

function saveToStorage(key: string) {
  try {
    localStorage.setItem(key, JSON.stringify(db[key] ?? []));
  } catch {}
}

loadFromStorage();

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      const user = parsed?.state?.user;
      if (user) config.headers["x-user"] = user;
    }
  } catch {}
  return config;
});

api.defaults.adapter = async (config) => {
  await new Promise((r) => setTimeout(r, 350));

  const user =
    (config.headers?.["x-user"] as string) ??
    (() => {
      try {
        return JSON.parse(localStorage.getItem("auth") ?? "{}").state?.user;
      } catch {
        return null;
      }
    })();

  if (!user) {
    return {
      data: { error: "Unauthorized" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config,
    };
  }

  const dbKey = `transactions_${user}`;

  if (config.method === "get" && config.url?.includes("transactions")) {
    return {
      data: db[dbKey] ?? [],
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }

  if (config.method === "post" && config.url?.includes("transactions")) {
    const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    const newTx: Transaction = { id: Date.now(), ...body };
    db[dbKey] = [newTx, ...(db[dbKey] ?? [])];
    saveToStorage(dbKey);
    return {
      data: newTx,
      status: 201,
      statusText: "Created",
      headers: {},
      config,
    };
  }

  return {
    data: { error: "Not found" },
    status: 404,
    statusText: "Not Found",
    headers: {},
    config,
  };
};
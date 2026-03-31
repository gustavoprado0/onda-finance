import { api } from "../lib/api";

export type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
};

export async function getTransactions(user: string): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>("/transactions", {
    headers: { "x-user": user },
  });
  return data;
}

export async function createTransaction(
  user: string,
  payload: Omit<Transaction, "id">
): Promise<Transaction> {
  const { data } = await api.post<Transaction>("/transactions", payload, {
    headers: { "x-user": user },
  });
  return data;
}
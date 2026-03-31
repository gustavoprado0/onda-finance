import { NewTransactionModal } from "../../components/NewTransactionModal";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../store/auth.store";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../../services/transactions";
import { TransactionList } from "../../components/TransactionList";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  PlusCircle,
  TrendingUp,
} from "lucide-react";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["transactions", user],
    queryFn: () => getTransactions(user!),
    enabled: !!user,
  });

  const income = data
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = data
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  const cards = [
    {
      label: "Saldo Total",
      value: formatBRL(balance),
      icon: Wallet,
      color: "text-white",
      accent: "bg-cyan-500/10 border-cyan-500/20",
      iconColor: "text-cyan-400",
      valueColor: balance >= 0 ? "text-white" : "text-red-400",
    },
    {
      label: "Entradas",
      value: formatBRL(income),
      icon: ArrowUpCircle,
      accent: "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    {
      label: "Saídas",
      value: formatBRL(expense),
      icon: ArrowDownCircle,
      accent: "bg-red-500/10 border-red-500/20",
      iconColor: "text-red-400",
      valueColor: "text-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
              <TrendingUp size={14} />
              <span>Visão geral</span>
            </div>
            <h1 className="text-2xl font-bold !text-white">Dashboard</h1>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold gap-2 h-10 cursor-pointer"
          >
            <PlusCircle size={16} />
            Nova transação
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl border p-5 ${card.accent} space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <card.icon size={18} className={card.iconColor} />
              </div>
              <p className={`text-2xl font-bold ${card.valueColor}`}>
                {isLoading ? (
                  <span className="inline-block w-28 h-7 bg-zinc-800 rounded animate-pulse" />
                ) : (
                  card.value
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium !text-white uppercase tracking-wider">
            Transações recentes
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-zinc-900 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <TransactionList data={data} />
          )}
        </div>
      </div>

      <NewTransactionModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
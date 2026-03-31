import type { Transaction } from "../services/transactions";
import { TransactionBadge } from "./TransactionBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function TransactionList({ data }: { data: Transaction[] }) {
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
        <p className="text-zinc-600 text-sm">Nenhuma transação ainda</p>
        <p className="text-zinc-700 text-xs mt-1">
          Clique em "Nova transação" para começar
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-500 text-xs uppercase tracking-wider font-medium">
              Descrição
            </TableHead>
            <TableHead className="text-zinc-500 text-xs uppercase tracking-wider font-medium">
              Tipo
            </TableHead>
            <TableHead className="text-zinc-500 text-xs uppercase tracking-wider font-medium text-right">
              Valor
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((t) => (
            <TableRow
              key={t.id}
              className="border-zinc-800/60 hover:bg-zinc-800/30 transition-colors"
            >
              <TableCell className="font-medium text-zinc-200 text-sm">
                {t.title}
              </TableCell>

              <TableCell>
                <TransactionBadge type={t.type} />
              </TableCell>

              <TableCell
                className={`text-right font-semibold text-sm ${t.type === "income" ? "text-emerald-400" : "text-red-400"
                  }`}
              >
                {t.type === "expense" ? "- " : "+ "}
                {formatCurrency(t.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
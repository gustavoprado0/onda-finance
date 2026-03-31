// src/components/TransactionBadge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "../lib/utils";

const transactionBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors select-none",
  {
    variants: {
      type: {
        income: [
          "border-green-200 bg-green-50 text-green-700",
          "dark:border-green-800 dark:bg-green-950 dark:text-green-400",
        ],
        expense: [
          "border-red-200 bg-red-50 text-red-700",
          "dark:border-red-800 dark:bg-red-950 dark:text-red-400",
        ],
      },
      size: {
        sm: "px-2 py-0.5 text-xs gap-1",
        md: "px-2.5 py-1 text-xs gap-1.5",
        lg: "px-3 py-1 text-sm gap-2",
      },
    },
    defaultVariants: {
      type: "income",
      size: "md",
    },
  }
);

type TransactionBadgeProps = VariantProps<typeof transactionBadgeVariants> & {
  className?: string;
};

export function TransactionBadge({
  type,
  size,
  className,
}: TransactionBadgeProps) {
  const isIncome = type === "income";

  const Icon = isIncome ? ArrowUpCircle : ArrowDownCircle;
  const label = isIncome ? "Entrada" : "Saída";

  return (
    <span className={cn(transactionBadgeVariants({ type, size }), className)}>
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
}

export { transactionBadgeVariants };
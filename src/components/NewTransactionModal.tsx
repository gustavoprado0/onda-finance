import { useState } from "react";
import { createTransaction } from "../services/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "../lib/utils";

export function NewTransactionModal({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const user = useAuthStore((s) => s.user)!;
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"income" | "expense">("income");

    const mutation = useMutation({
        mutationFn: (data: { title: string; amount: number; type: "income" | "expense" }) =>
            createTransaction(user, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions", user] });
            onOpenChange(false);
            setTitle("");
            setAmount("");
            setType("income");
        },
    });

    function handleSubmit() {
        const parsed = parseFloat(amount);
        if (!title || !amount || isNaN(parsed) || parsed <= 0) return;
        mutation.mutate({ title, amount: parsed, type });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-md sm:w-full bg-zinc-900 border-zinc-800 !text-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold !text-white">
                        Nova transação
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium !text-white uppercase tracking-wider">
                            Descrição
                        </label>
                        <Input
                            placeholder="Ex: Venda de produto"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 !text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/60 h-10"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium !text-white uppercase tracking-wider">
                            Valor (R$)
                        </label>
                        <Input
                            placeholder="0,00"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 !text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/60 h-10"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium !text-white uppercase tracking-wider">
                            Tipo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setType("income")}
                                className={cn(
                                    "flex items-center justify-center gap-2 h-10 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                                    type === "income"
                                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                        : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                <ArrowUpCircle size={15} />
                                Entrada
                            </button>

                            <button
                                type="button"
                                onClick={() => setType("expense")}
                                className={cn(
                                    "flex items-center justify-center gap-2 h-10 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                                    type === "expense"
                                        ? "bg-red-500/10 border-red-500/40 text-red-400"
                                        : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                <ArrowDownCircle size={15} />
                                Saída
                            </button>
                        </div>
                    </div>

                    <Button
                        className="w-full h-10 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold"
                        onClick={handleSubmit}
                        disabled={mutation.isPending || !title || !amount}
                    >
                        {mutation.isPending ? "Salvando..." : "Salvar transação"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
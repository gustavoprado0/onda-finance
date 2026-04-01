import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../../services/transactions";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { ArrowRight, Send, ShieldCheck } from "lucide-react";
import { transferSchema } from "../../schemas/transfer.schema";
import { z } from "zod";

export default function Transfer() {
  const user = useAuthStore((s) => s.user)!;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
  });

  const amount = (watch("amount") ?? 0) as number;
  const recipient = watch("recipient");

  const onSubmit = async (data: z.input<typeof transferSchema>) => {
    const parsed = transferSchema.parse(data);

    await createTransaction(user, {
      title: `Transferência para ${parsed.recipient}: ${parsed.title}`,
      amount: parsed.amount,
      type: "expense",
    });

    queryClient.invalidateQueries({ queryKey: ["transactions"] });

    toast.success(
      `Transferência de ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(parsed.amount)} enviada para ${parsed.recipient}!`
    );

    reset();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto p-6 space-y-8 pt-8">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <Send size={14} />
            <span>Enviar dinheiro</span>
          </div>
          <h1 className="text-2xl font-bold !text-white">Transferência</h1>
        </div>

        {(recipient || amount > 0) && (
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
              {user?.charAt(0)}
            </div>
            <ArrowRight size={16} className="text-zinc-600" />
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-xs uppercase">
              {recipient?.charAt(0) ?? "?"}
            </div>
            <span className="text-zinc-400 ml-1">
              {recipient ? (
                <>
                  <span className="text-white font-medium">{recipient}</span>
                  {amount > 0 && (
                    <span className="text-zinc-500">
                      {" "}
                      —{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(amount)}
                    </span>
                  )}
                </>
              ) : (
                "Destinatário não definido"
              )}
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium !text-white uppercase tracking-wider">
              Destinatário
            </label>
            <Input
              placeholder="Email do destinatário"
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/60 h-11"
              {...register("recipient")}
            />
            {errors.recipient && (
              <p className="text-red-400 text-xs">{errors.recipient.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium !text-white uppercase tracking-wider">
              Descrição
            </label>
            <Input
              placeholder="Ex: aluguel, pagamento de serviço..."
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/60 h-11"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-400 text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium !text-white uppercase tracking-wider">
              Valor (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/60 h-11"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-red-400 text-xs">{errors.amount.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              "Processando..."
            ) : (
              <>
                <Send size={16} />
                Confirmar transferência
              </>
            )}
          </Button>
        </form>

        <div className="flex items-start gap-3 text-xs text-zinc-600 px-1">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-zinc-700" />
          <p>
            Transferências são processadas instantaneamente e não podem ser
            canceladas após confirmação. Verifique os dados antes de enviar.
          </p>
        </div>
      </div>
    </div>
  );
}
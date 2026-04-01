import { z } from "zod";

export const transferSchema = z.object({
  recipient: z.string().min(1, "Informe o destinatário"),
  title: z.string().min(1, "Informe a descrição"),
  amount: z.preprocess(
    (val): number | undefined => {
      if (val === "" || val === null || val === undefined) return undefined;

      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(0.01, "Valor deve ser maior que zero")
  ),
});

export type TransferSchema = z.infer<typeof transferSchema>;
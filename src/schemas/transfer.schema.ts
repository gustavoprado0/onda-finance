import { z } from "zod";

export const transferSchema = z.object({
  recipient: z.string().min(1, "Informe o destinatário"),
  title: z.string().min(1, "Informe a descrição"),
  amount: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;

      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z
      .union([
        z.number().min(0.01, "Valor deve ser maior que zero"),
        z.undefined(),
      ])
      .refine((val) => val !== undefined, {
        message: "Informe um valor",
      })
  ),
});

export type TransferSchema = z.infer<typeof transferSchema>;
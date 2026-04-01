import { z } from "zod";

export const transferSchema = z.object({
    recipient: z.string().min(1, "Informe o destinatário"),
    title: z.string().min(1, "Informe a descrição"),
    amount:
        z.number().refine((val) => !isNaN(val), {
            message: "Informe um valor válido",
        })
            .min(0.01, "Valor deve ser maior que zero"),
});

export type TransferSchema = z.infer<typeof transferSchema>;
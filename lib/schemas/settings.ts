import { z } from "zod";

export const settingsSchema = z.object({
  saleNumber: z.number().min(0, { message: "0'dan büyük olmalıdır" }),
  discount: z
    .number()
    .min(0, { message: "0'dan büyük olmalıdır" })
    .max(1, { message: "1'den küçük olmalıdır" }),
  vat: z
    .number()
    .min(0, { message: "0'dan büyük olmalıdır" })
    .max(1, { message: "1'den küçük olmalıdır" }),
  profitMargin: z
    .number()
    .min(0, { message: "0'dan büyük olmalıdır" })
    .max(1, { message: "1'den küçük olmalıdır" }),
  exchangeRate: z.number().min(0, { message: "0'dan büyük olmalıdır" }),
  shippingPrice: z.number().min(0, { message: "0'dan büyük olmalıdır" }),
  saleStatusId: z.number().optional(),
});

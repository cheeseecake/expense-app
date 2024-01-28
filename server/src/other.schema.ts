import { z } from "zod";

export const createCurrencySchema = z.object({
  currency: z
    .string({
      required_error: "Name is required",
    })
    .toUpperCase(),
});

export const createCategorySchema = z.object({
  category: z
    .string({
      required_error: "Name is required",
    })
    .toUpperCase(),
  typeId: z.coerce.number({ required_error: "Type is required" }).int(),
});

export type createCurrencySchema = z.TypeOf<typeof createCurrencySchema>;
export type createCategorySchema = z.TypeOf<typeof createCategorySchema>;

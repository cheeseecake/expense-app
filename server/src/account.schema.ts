import { z } from "zod";

export const createAccountSchema = z.object({
  account: z.string({
    required_error: "Name is required",
  }),
  currencyId: z.coerce.number({ required_error: "Currency is required" }).int(),
  categoryId: z.coerce.number({ required_error: "Category is required" }).int(),
});

export const paramsInput = z.object({
  id: z.number(),
});

export const updateAccountSchema = z.object({
  paramsInput,
  body: z
    .object({
      account: z.string(),
      currencyId: z.number(),
      categoryId: z.number(),
    })
    .partial(),
});

export type createAccountSchema = z.TypeOf<typeof createAccountSchema>;
export type updateAccountSchema = z.TypeOf<typeof updateAccountSchema>;
export type paramsInput = z.TypeOf<typeof paramsInput>;
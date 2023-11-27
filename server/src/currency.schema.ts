import { z } from "zod";
export const createCurrencySchema = z.object({
    currency: z.string({
      required_error: "Name is required",
    }),
  });
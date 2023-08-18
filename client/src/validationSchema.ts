import { z } from "zod";
import { AccountType } from "../../server/types";

export const transactionSchema = z.object({
  createdAt: z.coerce
    .date()
    .min(new Date("1900-01-01"), { message: "Invalid date!" }),
  description: z.string().min(10, { message: "Required" }).trim(),
  counterparty: z.string().min(1, { message: "Required" }).trim(),
  accounts: z
    .array(
      z.object({
        accountId: z.coerce
          .number({ required_error: "Account is required" })
          .int(),
        amount: z.coerce
          .number({ required_error: "Amount is required" })
          .multipleOf(0.01)
          .refine((amount) => amount !== 0, { message: "Invalid Value" }),
      })
    )
    .refine(
      (accounts) =>
        accounts.reduce((total, account) => total + account.amount, 0) === 0,
      {
        message: "The sum of all amounts should be 0",
      }
    ),
});

export const accountSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  type: z.nativeEnum(AccountType),
});

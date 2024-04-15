/**
 * This file is the source of truth - you do not need to repeat this
 * typing anywhere else in the app.
 */

import { z } from "zod";

export const createTransactionSchema = z.object({
  createdAt: z.coerce.date(),
  description: z.string().min(10, { message: "Required" }).trim(),
  counterparty: z.string().min(1, { message: "Required" }).trim().toUpperCase(),
  journalEntries: z
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
      (journalEntries) =>
        journalEntries.reduce((total, account) => total + account.amount, 0) ===
        0,
      {
        message: "The sum of all amounts should be 0",
      }
    ),
});

export const paramsInput = z.object({
  id: z.number(),
});

export const updateTransactionSchema = z.object({
  paramsInput,
  body: z
    .object({
      createdAt: z.date(),
      description: z.string(),
      counterparty: z.string(),
      journalEntries: z.object({
        accountId: z.number(),
        amount: z.number(),
      }),
    })
    .partial(),
});
export const uploadTransactionSchema = z.array(
  z.object({
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    description: z.string(),
    counterparty: z.string(),
    JournalEntry: z.array(
      z.object({
        accountId: z.number().int(),
        amount: z.number(),
      })
    ),
  })
);

export type createTransactionSchema = z.TypeOf<typeof createTransactionSchema>;
export type updateTransactionSchema = z.TypeOf<typeof updateTransactionSchema>;
export type uploadTransactionSchema = z.TypeOf<typeof uploadTransactionSchema>;
export type paramsInput = z.TypeOf<typeof paramsInput>;

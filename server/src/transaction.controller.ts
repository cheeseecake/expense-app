import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "./index";
import {
  paramsInput,
  updateTransactionSchema,
  createTransactionSchema,
} from "./transaction.schema";

export const createTransactionController = async ({
  input,
}: {
  input: createTransactionSchema;
}) => {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        createdAt: input.createdAt,
        description: input.description,
        counterparty: input.counterparty,
        journalEntries: {
          create: input.journalEntries,
        },
      },
      include: {
        journalEntries: true,
      },
    });

    return {
      status: "success",
      data: {
        transaction,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Transaction already exists",
        });
      }
    }
    throw error;
  }
};

export const updateTransactionController = async ({
  paramsInput,
  input,
}: {
  paramsInput: paramsInput;
  input: updateTransactionSchema["body"];
}) => {
  try {
    const updateTransaction = await prisma.transaction.update({
      where: { id: paramsInput.id },
      data: input,
    });

    return {
      status: "success",
      note: updateTransaction,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Transaction already exists",
        });
      }
    }
    throw error;
  }
};

export const findTransactionController = async ({
  paramsInput,
}: {
  paramsInput: paramsInput;
}) => {
  try {
    const note = await prisma.transaction.findFirst({
      where: { id: paramsInput.id },
    });

    if (!note) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Transaction with that ID not found",
      });
    }

    return {
      status: "success",
      note,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const findAllTransactionsController = async () => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        journalEntries: {
          include: {
            account: {
              include: {
                categoryRef: true,
              },
            },
          },
        },
      },
    });

    return {
      status: "success",
      results: transactions.length,
      transactions,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteTransactionController = async ({
  paramsInput,
}: {
  paramsInput: paramsInput;
}) => {
  try {
    console.log(paramsInput.id);
    await prisma.transaction.delete({ where: { id: paramsInput.id } });

    return {
      status: "success",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction with that ID not found",
        });
      }
    }
    throw error;
  }
};

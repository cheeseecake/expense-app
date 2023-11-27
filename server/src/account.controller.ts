import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "./index";
import {
  paramsInput,
  updateAccountSchema,
  createAccountSchema,
} from "./account.schema";

export const createAccountController = async ({
  input,
}: {
  input: createAccountSchema;
}) => {
  try {
    const account = await prisma.account.create({
      data: {
        account: input.account,
        currencyId: input.currencyId,
        categoryId: input.categoryId,
      },
    });

    return {
      status: "success",
      data: {
        account,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Account already exists",
        });
      }
    }
    throw error;
  }
};

export const updateAccountController = async ({
  paramsInput,
  input,
}: {
  paramsInput: paramsInput;
  input: updateAccountSchema["body"];
}) => {
  try {
    const updateAccount = await prisma.account.update({
      where: { id: paramsInput.id },
      data: input,
    });

    return {
      status: "success",
      note: updateAccount,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Account already exists",
        });
      }
    }
    throw error;
  }
};

export const findAccountController = async ({
  paramsInput,
}: {
  paramsInput: paramsInput;
}) => {
  try {
    const note = await prisma.account.findFirst({
      where: { id: paramsInput.id },
    });

    if (!note) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Account with that ID not found",
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

export const findAllAccountsController = async () => {
  try {
    const raw_accounts = await prisma.account.findMany({
      orderBy: [
        {
          categoryId: "asc",
        },
        {
          account: "asc",
        },
      ],
      include: {
        journalEntries: true,
        currencyRef: true,
        categoryRef: true
      },
    });
    const accounts = raw_accounts.map((item) => ({
      id: item.id,
      account: item.account,
      category: item.categoryRef.category,
      type: item.categoryRef.typeId,
      currency: item.currencyRef.currency,
      sum: item.journalEntries.reduce((sum, je) => sum + je.amount, 0),
    }));

    return {
      status: "success",
      results: accounts.length,
      accounts,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteAccountController = async ({
  paramsInput,
}: {
  paramsInput: paramsInput;
}) => {
  try {
    console.log(paramsInput.id);
    await prisma.account.delete({ where: { id: paramsInput.id } });

    return {
      status: "success",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account with that ID not found",
        });
      }
    }
    throw error;
  }
};

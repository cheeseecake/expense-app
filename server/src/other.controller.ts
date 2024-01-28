import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "./index";
import { createCurrencySchema, createCategorySchema } from "./other.schema";

export const createCategoryController = async ({
  input,
}: {
  input: createCategorySchema;
}) => {
  try {
    const category = await prisma.category.create({
      data: {
        category: input.category,
        typeId: input.typeId,
      },
    });

    return {
      status: "success",
      data: {
        category,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Category already exists",
        });
      }
    }
    throw error;
  }
};

export const findAllCategoriesController = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        {
          typeId: "asc",
        },
        {
          category: "asc",
        },
      ],
    });
    return {
      status: "success",
      results: categories.length,
      categories,
    };
  } catch (error) {
    throw error;
  }
};

export const createCurrencyController = async ({
  input,
}: {
  input: createCurrencySchema;
}) => {
  try {
    const currency = await prisma.currency.create({
      data: {
        currency: input.currency,
      },
    });

    return {
      status: "success",
      data: {
        currency,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Currency already exists",
        });
      }
    }
    throw error;
  }
};

export const findAllCurrenciesController = async () => {
  try {
    const currencies = await prisma.currency.findMany({
      orderBy: [
        {
          id: "asc",
        },
      ],
    });
    return {
      status: "success",
      results: currencies.length,
      currencies,
    };
  } catch (error) {
    throw error;
  }
};

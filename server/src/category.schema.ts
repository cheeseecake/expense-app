import { z } from "zod";

export const createCategorySchema = z.object({
    category: z.string({
      required_error: "Name is required",
    }),
    typeId: z.coerce.number({ required_error: "Account is required" }).int(),
  });
  

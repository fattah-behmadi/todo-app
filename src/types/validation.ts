import { z } from "zod";

export const CreateTodoSchema = z.object({
  todo: z
    .string()
    .min(1, "Todo title cannot be empty")
    .max(200, "Todo title cannot be more than 200 characters"),
  completed: z.boolean().default(false),
  userId: z.number().int().positive().default(1),
});

export const UpdateTodoSchema = z.object({
  todo: z
    .string()
    .min(1, "Todo title cannot be empty")
    .max(200, "Todo title cannot be more than 200 characters")
    .optional(),
  completed: z.boolean().optional(),
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;

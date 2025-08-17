import { z } from 'zod';

export const CreateTodoSchema = z.object({
  todo: z.string()
    .min(1, 'عنوان Todo نمی‌تواند خالی باشد')
    .max(200, 'عنوان Todo نمی‌تواند بیشتر از 200 کاراکتر باشد'),
  completed: z.boolean().default(false),
  userId: z.number().int().positive().default(1),
});

export const UpdateTodoSchema = z.object({
  todo: z.string()
    .min(1, 'عنوان Todo نمی‌تواند خالی باشد')
    .max(200, 'عنوان Todo نمی‌تواند بیشتر از 200 کاراکتر باشد')
    .optional(),
  completed: z.boolean().optional(),
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;

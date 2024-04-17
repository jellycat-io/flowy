import * as z from 'zod';

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TI, TO> = {
  fieldErrors?: FieldErrors<TI>;
  error?: string | null;
  data?: TO;
};

export function createSafeAction<TI, TO>(
  schema: z.Schema<TI>,
  handler: (data: TI) => Promise<ActionState<TI, TO>>,
) {
  return async (data: TI): Promise<ActionState<TI, TO>> => {
    const validated = schema.safeParse(data);
    if (!validated.success) {
      return {
        fieldErrors: validated.error.flatten().fieldErrors,
      } as unknown as FieldErrors<TI>;
    }

    return handler(validated.data);
  };
}

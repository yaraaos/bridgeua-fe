import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string().trim().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type ResetPasswordFormErrors = Partial<
  Record<keyof ResetPasswordFormValues, string>
>;

export function validateResetPasswordForm(values: ResetPasswordFormValues) {
  const result = resetPasswordSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  const errors: ResetPasswordFormErrors = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof ResetPasswordFormValues;

    errors[field] = issue.message;
  });

  return errors;
}

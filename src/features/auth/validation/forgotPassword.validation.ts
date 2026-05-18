import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type ForgotPasswordFormErrors = Partial<
  Record<keyof ForgotPasswordFormValues, string>
>;

export function validateForgotPasswordForm(values: ForgotPasswordFormValues) {
  const result = forgotPasswordSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  const errors: ForgotPasswordFormErrors = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof ForgotPasswordFormValues;

    errors[field] = issue.message;
  });

  return errors;
}

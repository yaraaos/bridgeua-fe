import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z.string().trim().min(1, "Password is required"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export type SignInFormErrors = Partial<
  Record<keyof SignInFormValues, string>
>;

export function validateSignInForm(values: SignInFormValues) {
  const result = signInSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  const errors: SignInFormErrors = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof SignInFormValues;
    errors[field] = issue.message;
  });

  return errors;
}
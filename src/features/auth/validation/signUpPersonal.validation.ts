import { z } from "zod";

export const signUpPersonalSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().trim().min(1, "Password is required"),
    confirmPassword: z.string().trim().min(1, "Confirm password is required"),
    agree: z.boolean().refine((value) => value, {
      message: "You must agree to continue",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpPersonalFormValues = z.infer<typeof signUpPersonalSchema>;

export type SignUpPersonalFormErrors = Partial<
  Record<keyof SignUpPersonalFormValues, string>
>;

export function validateSignUpPersonalForm(values: SignUpPersonalFormValues) {
  const result = signUpPersonalSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  const errors: SignUpPersonalFormErrors = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof SignUpPersonalFormValues;
    errors[field] = issue.message;
  });

  return errors;
}
import { z } from "zod";

export const signUpBusinessSchema = z
  .object({
    businessName: z.string().trim().min(1, "Business name is required"),
    ownerName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().trim().min(1, "Password is required"),
    confirmPassword: z.string().trim().min(1, "Confirm password is required"),
    category: z.string().trim().min(1, "Category is required"),
    address: z.string().trim().min(1, "Address is required"),
    zipCode: z.string().trim().min(1, "ZIP code is required"),
    city: z.string().trim().min(1, "City is required"),
    state: z.string().trim().min(1, "State is required"),
    agree: z.boolean().refine((value) => value, {
      message: "You must agree to continue",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpBusinessFormValues = z.infer<typeof signUpBusinessSchema>;

export type SignUpBusinessFormErrors = Partial<
  Record<keyof SignUpBusinessFormValues, string>
>;

export function validateSignUpBusinessForm(values: SignUpBusinessFormValues) {
  const result = signUpBusinessSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  const errors: SignUpBusinessFormErrors = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof SignUpBusinessFormValues;
    errors[field] = issue.message;
  });

  return errors;
}
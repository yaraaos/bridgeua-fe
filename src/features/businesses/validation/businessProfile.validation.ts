import { z } from "zod";

export const BUSINESS_NAME_RECOMMENDED_LIMIT = 60;
export const BUSINESS_NAME_HARD_LIMIT = 80;
export const BUSINESS_DESCRIPTION_MAX_LENGTH = 3000;

export const BUSINESS_NAME_TOO_LONG_MESSAGE = `Business name cannot be longer than ${BUSINESS_NAME_HARD_LIMIT} characters.`;
export const BUSINESS_DESCRIPTION_TOO_LONG_MESSAGE = `Description cannot be longer than ${BUSINESS_DESCRIPTION_MAX_LENGTH} characters.`;

export const businessNameSchema = z
  .string()
  .trim()
  .min(1, "Business name is required")
  .max(BUSINESS_NAME_HARD_LIMIT, BUSINESS_NAME_TOO_LONG_MESSAGE);

export const businessDescriptionSchema = z
  .string()
  .max(
    BUSINESS_DESCRIPTION_MAX_LENGTH,
    BUSINESS_DESCRIPTION_TOO_LONG_MESSAGE,
  );

export function isBusinessNameNearLimit(value: string) {
  return value.length > BUSINESS_NAME_RECOMMENDED_LIMIT;
}

export function isBusinessNameOverLimit(value: string) {
  return value.length > BUSINESS_NAME_HARD_LIMIT;
}

export function isBusinessDescriptionOverLimit(value: string) {
  return value.length > BUSINESS_DESCRIPTION_MAX_LENGTH;
}
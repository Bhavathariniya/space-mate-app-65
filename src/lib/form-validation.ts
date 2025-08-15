import { z } from "zod";

// Common validation patterns
const patterns = {
  phone: /^\+?[1-9]\d{1,14}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
};

// Common validation messages
export const messages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  password: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
  username: "Username must be between 3-20 characters and can only contain letters, numbers and underscores",
  min: (field: string, length: number) => `${field} must be at least ${length} characters`,
  max: (field: string, length: number) => `${field} must be at most ${length} characters`,
  matches: (field: string) => `Passwords must match`,
  url: "Please enter a valid URL",
  number: "Please enter a valid number",
  date: "Please enter a valid date",
};

// Base schemas
export const baseSchemas = {
  email: z.string().email(messages.email),
  phone: z.string().regex(patterns.phone, messages.phone),
  password: z.string().regex(patterns.password, messages.password),
  username: z.string().regex(patterns.username, messages.username),
  name: z.string().min(2, messages.min("Name", 2)).max(50, messages.max("Name", 50)),
  url: z.string().url(messages.url),
  number: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  date: z.date(),
};

// Form schemas
export const loginSchema = z.object({
  email: baseSchemas.email,
  password: z.string().min(8, messages.min("Password", 8)),
});

export const registerSchema = z.object({
  username: baseSchemas.username,
  email: baseSchemas.email,
  password: baseSchemas.password,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: messages.matches("Password"),
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone.optional(),
  bio: z.string().max(500, messages.max("Bio", 500)).optional(),
  website: baseSchemas.url.optional(),
});

export const bookingSchema = z.object({
  checkIn: baseSchemas.date,
  checkOut: baseSchemas.date,
  guests: z.number().min(1).max(10),
  specialRequests: z.string().max(1000).optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});

export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  name: baseSchemas.name,
});

// Helper function to validate form data
export async function validateForm<T>(
  schema: z.ZodType<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: z.ZodError }> {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Helper function to format validation errors
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  errors.errors.forEach((error) => {
    const path = error.path.join(".");
    formattedErrors[path] = error.message;
  });
  return formattedErrors;
}

export function useFormValidation<T>(schema: z.ZodType<T>) {
  const validate = async (data: unknown) => {
    const result = await validateForm(schema, data);
    if (!result.success && 'errors' in result) {
      return formatValidationErrors(result.errors);
    }
    return null;
  };

  return { validate };
}
import { z } from 'zod';

export const mentorSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  expertise: z
    .array(z.string().min(1, "Expertise cannot be empty"))
    .nonempty("At least one expertise is required"),
  availability: z.string().min(1, "Availability is required"),
  base_rate: z.string().min(1, "Base rate is required"),
  bio: z.string().optional(),
  skills: z.string().optional(),
});

export const studentSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  education_level: z.string().min(1, "Education level is required"),
  interests: z
    .array(z.string().min(1, "Interest cannot be empty"))
    .nonempty("At least one interest is required"),
  bio: z.string().optional(),
});

export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');
import { z } from "zod";

export const step1Schema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export const step2Schema = z.object({
  servicesOffered: z
    .string()
    .refine(
      (v) => v.trim().split(/\s+/).filter(Boolean).length >= 50,
      "Please describe your services in detail — at least 50 words"
    ),
  serviceArea: z.string().min(2, "Please enter your service area"),
  targetAudience: z.string().min(5, "Please describe your target audience"),
  businessDescription: z.string().min(20, "Please provide a business description (at least 20 characters)"),
});

export const step3Schema = z.object({
  preferredColors: z.string().min(1, "Please select preferred colors"),
  preferredStyle: z.string().min(1, "Please select a preferred style"),
  competitorWebsites: z.string().optional(),
  websitesTheyLike: z.string().optional(),
});

export const step4Schema = z.object({
  featuresNeeded: z.array(z.string()).min(1, "Please select at least one feature"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

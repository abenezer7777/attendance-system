import * as z from "zod";
export const orgLevel = z.enum(["DIVISION", "DEPARTMENT", "SECTION"]);
export const LocationCategory = z.enum([
  "CAAZ",
  "CER",
  "CNR",
  "CWR",
  "EAAZ",
  "EER",
  "ER",
  "HEAD_QUARTER",
  "NAAZ",
  "NEER",
  "NER",
  "NNWR",
  "NR",
  "NWR",
  "SAAZ",
  "SER",
  "SR",
  "SSWR",
  "SWAAZ",
  "SWR",
  "SWWR",
  "WAAZ",
  "WWR",
  "WR",
]);
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createOrganizationSchema = z.object({
  id: z.string().optional(),
  level: orgLevel,
  name: z.string().min(1, {
    message: "Organization name is required",
  }),
  parentId: z.string().optional(),
});

// export const LoginSchema = z.object({
//   email: z.string().min(1, "Email is required"),
//   password: z.string().min(1, "Password is required"),
// });
export const createUserSchema = z.object({
  // id: z.string().optional(),
  id: z
    .string()
    .min(1, "Employee number is required")
    .regex(/^\d+$/, "Employee number must be a valid number"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  fullName: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  roleName: z.string().min(1, "Role is required"),
  jobTitle: z.string().min(1, "Job Title is required"),
  jobRole: z.string().min(1, "Job Role is required"),
  supervisorId: z.string().optional(),
  mobile: z
    .string()
    .regex(/^\d{9,}$/, "Invalid mobile number")
    .or(z.literal("")),
  organizationId: z.string(),
  assignedLocationIds: z
    .array(z.string())
    .min(1, "At least one location is required"),
});

// export const editUserSchema = z.object({
//   id: z.string(),
//   employeeId: z.string(),
//   email: z.string(),
//   fullName: z.string(),
//   username: z.string(),
//   password: z.string().optional(),
//   roleName: z.string().optional(),
// });

export const locationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: LocationCategory,
  latitude: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z
      .number()
      .min(3.4, "Latitude must be at least 3.4° N (southern Ethiopia)")
      .max(15, "Latitude must be at most 15° N (northern Ethiopia)")
  ),
  longitude: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z
      .number()
      .min(33, "Longitude must be at least 33° E (western Ethiopia)")
      .max(48, "Longitude must be at most 48° E (eastern Ethiopia)")
  ),
  radius: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().positive("Radius must be positive")
  ),
});
export const editUserSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleName: z.string().min(1, "Role is required"),
  organizationId: z.string().min(1, "Organization is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobRole: z.string().min(1, "Job role is required"),
  mobile: z.string().optional(),
  supervisorId: z.string().optional().nullable(),
  assignedLocationIds: z.array(z.string()).optional().default([]),
});

export const updateUserSchema = editUserSchema.omit({ password: true });

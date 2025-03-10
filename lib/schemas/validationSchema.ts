import * as z from "zod";
export const orgLevel = z.enum(["DIVISION", "DEPARTMENT", "SECTION"]);
export const status = z.enum([
  "CHECKED_IN",
  "EARLY_LEAVE",
  "PRESENT",
  "LATE",
  "ABSENT",
  "AUTO_CHECKOUT",
]);
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
  id: z.string().min(1, "Employee ID is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  fullName: z.string().min(1, "Name is required"),
  // password: z.string().min(6, "Password must be at least 6 characters long"),
  roleName: z.string().min(1, "Role is required"),
  immediateSupervisor: z.string(),
  // supervisorId: z.string().optional(),
  phone: z
    .string()
    .regex(/^\d{9,}$/, "Invalid mobile number")
    .optional(),
  division: z.string().optional(),
  department: z.string().optional(),
  section: z.string().optional(),
  jobTitle: z.string().min(1, "Job Title is required"),
  jobRole: z.string().min(1, "Job Role is required"),
  location: z.string().min(1, "location is required"),
  locationCategory: z.string().min(1, "locationCategory is required"),
  category: z.string().min(1, "Category  is required"),
});

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
  id: z.string().min(1, "Employee ID is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  fullName: z.string().min(1, "Name is required"),
  // password: z.string().min(6, "Password must be at least 6 characters long"),
  roleName: z.string().min(1, "Role is required"),
  immediateSupervisor: z.string(),
  // supervisorId: z.string().optional(),
  phone: z
    .string()
    .regex(/^\d{9,}$/, "Invalid mobile number")
    .optional(),
  division: z.string().optional(),
  department: z.string().optional(),
  section: z.string().optional(),
  jobTitle: z.string().min(1, "Job Title is required"),
  jobRole: z.string().min(1, "Job Role is required"),
  location: z.string().min(1, "location is required"),
  locationCategory: z.string().min(1, "locationCategory is required"),
  category: z.string().min(1, "Category  is required"),
  // assignedLocationIds: z.array(z.string()).optional().default([]),
});

// export const updateUserSchema = editUserSchema

export const reportSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  fullName: z.string(),
  checkIn: z.string(),
  checkOut: z.string().optional(),
  location: z.string(),
  locationCategory: z.string(),
  building: z.string(),
  division: z.string().optional(),
  department: z.string().optional(),
  section: z.string().optional(),
  status: z.string(),
});
export type Report = z.infer<typeof reportSchema>;

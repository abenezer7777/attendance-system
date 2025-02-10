import { z } from "zod";
// const MAX_FILE_SIZE = 1_000_000;
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const LetterStatus = z.enum(["DRAFT", "SENT", "ARCHIVED"]);

export const createLetterSchema = z.object({
  id: z.string().optional(),
  subject: z.string().min(3, "Subject is minimum 3 character").max(255),
  description: z.string().min(10, "Description is minimum 10 character"),
  recipient: z.string().min(1, "Recipient is required").max(255),
  letterDate: z.date({
    required_error: "Letter date is required.",
    invalid_type_error: "Invalid date format.",
  }),

  attachment: z
    .any()
    // .instanceof(File)
    .optional() // Makes the attachment field optional
    .refine(
      (file) => {
        if (!file?.[0]) {
          console.log("🚀 ~ file:", file);
          return true;
        }

        return file?.[0].size <= MAX_FILE_SIZE;
      },
      {
        message: `Max file size is 1MB.`,
      }
    )
    .refine(
      (file) => {
        if (!file?.[0]) {
          console.log("🚀 ~ file:", file);
          return true;
        }
        return file && ACCEPTED_IMAGE_TYPES.includes(file?.[0].type);
      },
      {
        message:
          "Only .jpg, .jpeg, .png, .pdf, .doc, and .docx files are accepted.",
      }
    ),
  organizationId: z.string().min(1, "organization is required"),

  status: LetterStatus,
});

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
export const OrganizationsSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export const editLetterSchema = z.object({
  id: z.string().optional(),
  subject: z.string().min(3, "Subject is minimum 3 character").max(255),
  description: z.string().min(10, "Description is minimum 10 character"),
  recipient: z.string().min(1, "Recipient is required").max(255),
  letterDate: z.date({
    required_error: "Letter date is required.",
    invalid_type_error: "Invalid date format.",
  }),

  attachment: z
    .any()
    // .instanceof(File)
    .optional() // Makes the attachment field optional
    .refine(
      (file) => {
        if (!file?.[0]) {
          console.log("🚀 ~ file:", file);
          return true;
        }

        return file?.[0].size <= MAX_FILE_SIZE;
      },
      {
        message: `Max file size is 1MB.`,
      }
    )
    .refine(
      (file) => {
        if (!file?.[0]) {
          console.log("🚀 ~ file:", file);
          return true;
        }
        return file && ACCEPTED_IMAGE_TYPES.includes(file?.[0].type);
      },
      {
        message:
          "Only .jpg, .jpeg, .png, .pdf, .doc, and .docx files are accepted.",
      }
    ),
  // .min(1, { message: "Organization is required." }),
  status: LetterStatus,
});

export const createUserSchema = z.object({
  id: z.string().optional(),
  employeeId: z
    .string()
    .min(1, "Employee number is required")
    .regex(/^\d+$/, "Employee number must be a valid number"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  fullName: z.string().min(1, "Name is required"),
  // username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  roleName: z.string().min(1, "Role is required"),
  division: z.string().min(1, "Division is required"),
  department: z.string().min(1, "Department is required"),
  section: z.string().min(1, "Section is required"),
  locationCategory: z.string().min(1, "Location Category required "),
  location: z.string().min(1, "Location  required "),
  jobTitle: z.string().min(1, "Job Title required "),
  jobRole: z.string().min(1, "Job Role required "),
});
export const editUserSchema = z.object({
  id: z.string(),
  employeeId: z.string(),

  email: z.string(),
  fullName: z.string(),
  username: z.string(),
  password: z.string().optional(),
  roleName: z.string().optional(),
});

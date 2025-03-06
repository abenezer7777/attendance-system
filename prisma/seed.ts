import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma Client
const prisma = new PrismaClient();

// Constants
const DEFAULT_ORG_ID = "org1";
const DEFAULT_PASSWORD = "password123";
const SALT_ROUNDS = 10;

// Location mapping (customize based on your database)
const locationMapping: { [key: string]: string } = {
  SR: "loc_sr",
  ER: "loc_er",
  NR: "loc_nr",
  NER: "loc_ner",
  NEER: "loc_neer",
  WAAAZ: "loc_waaaz",
  NAAAZ: "loc_naaaz",
  "Head Quarter": "loc_hq",
  "LEGHR-HEAD QUARTER": "loc_hq",
  // Add more mappings as needed
};

// Generate email
const generateEmail = (employeeId: string) => `${employeeId}@organization.com`;

// Generate hashed password
const generatePassword = async () =>
  await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

async function createInitialRoles() {
  const roles = ["ADMIN", "OFFICER", "SUPERVISOR"];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
      },
    });
  }
}

async function createInitialOrganizations() {
  const divisions = [
    "Finance",
    "Sales",
    "Network Infrastructure",
    "Communication",
    "Physical Security",
  ];

  for (const divisionName of divisions) {
    const orgId = `org_${divisionName.toLowerCase().replace(/\s+/g, "_")}`;
    await prisma.organization.upsert({
      where: {
        id: orgId,
      },
      update: {},
      create: {
        id: orgId,
        name: divisionName,
        level: "DIVISION",
      },
    });
  }
}

async function seedUsers() {
  try {
    // Read the CSV file
    const csvFilePath = path.resolve(__dirname, "../attachment/employee.csv");
    const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Get default role (OFFICER)
    const defaultRole = await prisma.role.findFirstOrThrow({
      where: { name: "OFFICER" },
    });

    // Get or create default organization
    const defaultOrg = await prisma.organization.findFirst({
      where: { level: "DIVISION", name: "Finance" },
    });

    if (!defaultOrg) {
      throw new Error("Default organization not found");
    }

    // Process each record
    for (const record of records) {
      const hashedPassword = await bcrypt.hash("password123", 10); // Default password

      // Clean up the mobile number
      const cleanMobile = record.mobile
        ? record.mobile.toString().padStart(10, "0")
        : null;

      try {
        await prisma.user.upsert({
          where: { employeeId: record.employeeId },
          update: {
            fullName: record.fullName,
            email: record.email,
            jobTitle: record.jobTitle,
            jobRole: record.jobRole,
            mobile: cleanMobile,
            organizationId: defaultOrg.id,
            roleId: defaultRole.id,
          },
          create: {
            employeeId: record.employeeId,
            fullName: record.fullName,
            email: record.email,
            password: hashedPassword,
            jobTitle: record.jobTitle,
            jobRole: record.jobRole,
            mobile: cleanMobile,
            organizationId: defaultOrg.id,
            roleId: defaultRole.id,
          },
        });

        console.log(`Processed user: ${record.fullName}`);
      } catch (error) {
        console.error(`Error processing user ${record.fullName}:`, error);
      }
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

async function main() {
  console.log("Starting seeding...");

  // Create initial roles and organizations
  await createInitialRoles();
  await createInitialOrganizations();

  // Seed users
  await seedUsers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

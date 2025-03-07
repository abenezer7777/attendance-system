import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function parseCSV(filePath: string): Promise<any[]> {
  const records: any[] = [];
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  );

  for await (const record of parser) {
    records.push(record);
  }

  return records;
}

function determineRole(jobRole: string): string {
  const normalizedRole = jobRole.toLowerCase().trim();

  if (normalizedRole.includes("supervisor")) return "SUPERVISOR";
  if (normalizedRole.includes("manager")) return "MANAGER";
  if (normalizedRole.includes("officer")) return "OFFICER";
  if (normalizedRole.includes("executive")) return "EXECUTIVE";
  if (normalizedRole.includes("chief_executive")) return "CHIEF_EXECUTIVE";

  return "EMPLOYEE";
}

async function ensureRolesExist() {
  const roles = [
    "EMPLOYEE",
    "SUPERVISOR",
    "MANAGER",
    "OFFICER",
    "EXECUTIVE",
    "CHIEF_EXECUTIVE",
    "ADMIN",
  ];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
      },
    });
  }

  console.log("Roles created successfully");
}

async function main() {
  try {
    // First ensure all roles exist
    await ensureRolesExist();

    const csvPath = path.join(__dirname, "data", "employees.csv");
    const employees = await parseCSV(csvPath);

    console.log(`Found ${employees.length} employees in CSV file`);

    for (const employee of employees) {
      // Determine the role based on job_role
      const roleName = determineRole(employee.job_role);

      // Get the role record
      const role = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!role) {
        throw new Error(`Role ${roleName} not found`);
      }

      // Create or update the employee with role
      await prisma.employee.upsert({
        where: { id: employee.employee_number },
        update: {
          fullName: employee.full_name,
          email: employee.email,
          division: employee.division,
          department: employee.department,
          section: employee.section,
          group: employee.group,
          immediateSupervisor: employee.supervisor,
          location: employee.location,
          locationCategory: employee.location_category,
          jobTitle: employee.job_title,
          category: employee.category,
          jobRole: employee.job_role,
          phone: employee.mobile_no,
          roles: {
            set: [{ id: role.id }], // Set the role for the employee
          },
        },
        create: {
          id: employee.employee_number,
          fullName: employee.full_name,
          email: employee.email,
          division: employee.division,
          department: employee.department,
          section: employee.section,
          group: employee.group,
          immediateSupervisor: employee.supervisor,
          location: employee.location,
          locationCategory: employee.location_category,
          jobTitle: employee.job_title,
          category: employee.category,
          jobRole: employee.job_role,
          phone: employee.mobile_no,
          roles: {
            connect: [{ id: role.id }], // Connect the role to the employee
          },
        },
      });
    }

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// import { PrismaClient } from "@prisma/client";
// import { parse } from "csv-parse";
// import * as fs from "fs";
// import * as path from "path";

// const prisma = new PrismaClient();

// async function parseCSV(filePath: string): Promise<any[]> {
//   const records: any[] = [];
//   const parser = fs.createReadStream(filePath).pipe(
//     parse({
//       columns: true,
//       skip_empty_lines: true,
//       trim: true,
//     })
//   );

//   for await (const record of parser) {
//     records.push(record);
//   }

//   return records;
// }

// async function main() {
//   try {
//     const csvPath = path.join(__dirname, "data", "employee.csv");
//     const employees = await parseCSV(csvPath);

//     console.log(`Found ${employees.length} employees in CSV file`);

//     for (const employee of employees) {
//       await prisma.employee.upsert({
//         where: { id: employee.employee_number },
//         update: {
//           fullName: employee.full_name,
//           email: employee.email,
//           division: employee.division,
//           department: employee.department,
//           section: employee.section,
//           group: employee.group,
//           immediateSupervisor: employee.supervisor,
//           location: employee.location,
//           locationCategory: employee.location_category,
//           jobTitle: employee.job_title,
//           category: employee.category,
//           jobRole: employee.job_role,
//           phone: employee.mobile_no,
//         },
//         create: {
//           id: employee.employee_number,
//           fullName: employee.full_name,
//           email: employee.email,
//           division: employee.division,
//           department: employee.department,
//           section: employee.section,
//           group: employee.group,
//           immediateSupervisor: employee.supervisor,
//           location: employee.location,
//           locationCategory: employee.location_category,
//           jobTitle: employee.job_title,
//           category: employee.category,
//           jobRole: employee.job_role,
//           phone: employee.mobile_no,
//         },
//       });
//     }

//     console.log("Seed completed successfully");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });

// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import fs from "fs";
// import path from "path";
// import { parse } from "csv-parse/sync";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Initialize Prisma Client
// const prisma = new PrismaClient();

// // Constants
// const DEFAULT_ORG_ID = "org1";
// const DEFAULT_PASSWORD = "password123";
// const SALT_ROUNDS = 10;

// // Location mapping (customize based on your database)
// const locationMapping: { [key: string]: string } = {
//   SR: "loc_sr",
//   ER: "loc_er",
//   NR: "loc_nr",
//   NER: "loc_ner",
//   NEER: "loc_neer",
//   WAAAZ: "loc_waaaz",
//   NAAAZ: "loc_naaaz",
//   "Head Quarter": "loc_hq",
//   "LEGHR-HEAD QUARTER": "loc_hq",
//   // Add more mappings as needed
// };

// // Generate email
// const generateEmail = (employeeId: string) => `${employeeId}@organization.com`;

// // Generate hashed password
// const generatePassword = async () =>
//   await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

// async function createInitialRoles() {
//   const roles = ["ADMIN", "OFFICER", "SUPERVISOR"];

//   for (const roleName of roles) {
//     await prisma.role.upsert({
//       where: { name: roleName },
//       update: {},
//       create: {
//         name: roleName,
//       },
//     });
//   }
// }

// async function createInitialOrganizations() {
//   const divisions = [
//     "Finance",
//     "Sales",
//     "Network Infrastructure",
//     "Communication",
//     "Physical Security",
//   ];

//   for (const divisionName of divisions) {
//     const orgId = `org_${divisionName.toLowerCase().replace(/\s+/g, "_")}`;
//     await prisma.organization.upsert({
//       where: {
//         id: orgId,
//       },
//       update: {},
//       create: {
//         id: orgId,
//         name: divisionName,
//         level: "DIVISION",
//       },
//     });
//   }
// }

// async function seedUsers() {
//   try {
//     // Read the CSV file
//     const csvFilePath = path.resolve(__dirname, "../attachment/employee.csv");
//     const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

//     // Parse CSV content
//     const records = parse(fileContent, {
//       columns: true,
//       skip_empty_lines: true,
//     });

//     // Get default role (OFFICER)
//     const defaultRole = await prisma.role.findFirstOrThrow({
//       where: { name: "OFFICER" },
//     });

//     // Get or create default organization
//     const defaultOrg = await prisma.organization.findFirst({
//       where: { level: "DIVISION", name: "Finance" },
//     });

//     if (!defaultOrg) {
//       throw new Error("Default organization not found");
//     }

//     // Process each record
//     for (const record of records) {
//       const hashedPassword = await bcrypt.hash("password123", 10); // Default password

//       // Clean up the mobile number
//       const cleanMobile = record.mobile
//         ? record.mobile.toString().padStart(10, "0")
//         : null;

//       try {
//         await prisma.employee.upsert({
//           where: { employeeId: record.employeeId },
//           update: {
//             fullName: record.fullName,
//             email: record.email,
//             jobTitle: record.jobTitle,
//             jobRole: record.jobRole,
//             mobile: cleanMobile,
//             organizationId: defaultOrg.id,
//             roleId: defaultRole.id,
//           },
//           create: {
//             employeeId: record.employeeId,
//             fullName: record.fullName,
//             email: record.email,
//             password: hashedPassword,
//             jobTitle: record.jobTitle,
//             jobRole: record.jobRole,
//             mobile: cleanMobile,
//             organizationId: defaultOrg.id,
//             roleId: defaultRole.id,
//           },
//         });

//         console.log(`Processed user: ${record.fullName}`);
//       } catch (error) {
//         console.error(`Error processing user ${record.fullName}:`, error);
//       }
//     }

//     console.log("Seeding completed successfully");
//   } catch (error) {
//     console.error("Error during seeding:", error);
//     throw error;
//   }
// }

// async function main() {
//   console.log("Starting seeding...");

//   // Create initial roles and organizations
//   await createInitialRoles();
//   await createInitialOrganizations();

//   // Seed users
//   await seedUsers();
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

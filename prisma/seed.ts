// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create initial users
  // await prisma.user.create({
  //   data: {
  //     name: "Admin User",
  //     email: "admin@example.com",
  //     password: "Admin@1234", // Store hashed passwords in production
  //     // role: "ADMIN",
  //   },
  // });

  // Create initial locations
  await prisma.location.create({
    data: {
      name: "Main Office",
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 100, // 100 meters
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

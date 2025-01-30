import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/utils/authOption";
import { createMongoAbility } from "@casl/ability";
import { authOptions } from "./auth";

export const fetchCurrentUserWithAbilities = async (email: string | null) => {
  if (!email) {
    throw new Error("Unauthorized: No email in session");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          abilities: true,
        },
      },
    },
  });

  if (!currentUser) {
    throw new Error("Unauthorized: User not found");
  }

  return currentUser;
};

export const getUserSessionAndAbility = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized: No active session");
  }

  const currentUser = await fetchCurrentUserWithAbilities(session.user.email);

  // Build and return CASL abilities
  const ability = createMongoAbility(currentUser.role.abilities);
  return { currentUser, ability };
};

"use client";
import { createMongoAbility } from "@casl/ability";
import { AbilityContext } from "./Can";
import { useGetCurrentUserQuery } from "./user.query";

// import {useGetCurrentUserQuery} from "@app/(main)/users/users.query"

export default function AbilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useGetCurrentUserQuery();
  console.log("🚀 ~ data:", data);

  //   const { data } = useCurrentUser();
  const ability = createMongoAbility(data?.role?.abilities ?? []);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
// "use client";

// import { useSession } from "next-auth/react";
// import { AbilityContext } from "./Can";
// import { createMongoAbility } from "@casl/ability";

// export function AbilityProvider({ children }: { children: React.ReactNode }) {
//   // get session
//   const { data: session } = useSession();
//   console.log("session for casl", session);
//   const role = session?.user?.role;
//   console.log("role for casl", role);

//   const ability = createMongoAbility(session?.user.abilities);

//   return (
//     <AbilityContext.Provider value={ability}>
//       {children}
//     </AbilityContext.Provider>
//   );
// }

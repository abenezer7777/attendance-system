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

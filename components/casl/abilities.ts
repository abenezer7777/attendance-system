import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Ability as AbilityModel } from "@prisma/client";

export function AbilityBuilderFor(abilities: AbilityModel[]) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  // Loop through each ability and set permissions
  abilities.forEach(({ action, subject }) => {
    can(action, subject);
  });

  return build();
}

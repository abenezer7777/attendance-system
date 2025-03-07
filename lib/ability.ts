import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects = "Attendance" | "Employee" | "Building" | "all";

export function defineAbilityFor(role: string) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  switch (role) {
    case "ADMIN":
      can("manage", "all");
      break;
    case "CHIEF_EXECUTIVE":
      can(['read', 'update'], ['Attendance', 'Employee', 'Building']);
      
      break;
    case "EXECUTIVE":
      can("read", ["Attendance", "Employee", "Building"]);
      can("update", "Attendance", { devisionId: "user.divisionId" });
    case "OFFICER":
      can("read", ["Attendance", "Employee", "Building"]);
      can("update", "Attendance", { departmentId: "user.departmentId" });
      break;
    case "MANAGER":
      can("read", ["Attendance", "Employee"]);
      can("update", "Attendance", { sectionId: "user.sectionId" });
      break;
    case "SUPERVISOR":
      can("read", ["Attendance", "Employee"]);
      can("update", "Attendance", { immediateSupervisor: "user.id" });
      break;
    case "EMPLOYEE":
      can("read", "Attendance", { employeeId: "user.id" });
      break;
    default:
      cannot("manage", "all");
  }

  return build();
}

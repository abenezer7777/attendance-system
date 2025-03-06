import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'Attendance' | 'User' | 'Organization' | 'Location' | 'all';

export function defineAbilityFor(role: string) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  switch (role) {
    case 'admin':
      can('manage', 'all');
      break;
    case 'chief_executive':
      can(['read', 'update'], ['Attendance', 'User', 'Organization', 'Location']);
      break;
    case 'manager':
      can('read', ['Attendance', 'User', 'Organization', 'Location']);
      can('update', 'Attendance');
      break;
    case 'supervisor':
      can('read', ['Attendance', 'User']);
      can('update', 'Attendance', { organizationId: { $in: ['user.organizationId'] } });
      break;
    case 'employee':
      can('read', 'Attendance', { userId: 'user.id' });
      break;
    default:
      cannot('manage', 'all');
  }

  return build();
}
import "next-auth";
export type Ability = {
  subject: string;
  action: string;
};

export type Role = {
  name: string;
  abilities: Ability[];
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: {
      abilities: {
        action: string[];
        id: string;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        subject: string;
      }[];
    };
  }
}

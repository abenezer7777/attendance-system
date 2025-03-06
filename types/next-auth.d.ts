import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: {
      id: string;
      name: string;
    };
  }
}

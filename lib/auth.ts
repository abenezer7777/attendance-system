import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import LdapClient from "ldapjs-client";
import { FormField } from "@/components/ui/form";
import { LoginSchema } from "./schemas/validationSchema";
import { z } from "zod";

const ldapClient = new LdapClient({ url: "ldap://172.22.186.7" });

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 10 * 60, // 10 minutes in seconds
    updateAge: 2 * 60, // Update session every 5 minutes
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { email, password } = await LoginSchema.parseAsync(credentials);
          const [username] = email.split("@");

          const domain = "ethio.local";
          const dn = `${username}@${domain}`;
          // await ldapClient.bind(dn, password);

          const user = await prisma.user.findUnique({
            where: { email: email },
            include: {
              role: {
                include: {
                  abilities: true,
                },
              },
            },
          });

          if (!user) {
            return null;
          }

          // const isPasswordValid = await compare(credentials.password, user.password);

          // if (!isPasswordValid) {
          //   return null;
          // }

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
          };
        } catch (error) {
          throw new Error("Invalid credentials.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcryptjs";
// import LdapClient from "ldapjs-client";

// const ldapClient = new LdapClient({ url: "ldap://172.22.186.7" });

// export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//     maxAge: 10 * 60, // 10 minutes in seconds
//     updateAge: 2 * 60, // Update session every 5 minutes
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }
//         // const [username] = credentials.email.split("@");
//         // console.log("🚀 ~ authorize ~ username:", username);

//         // const domain = "ethio.local";
//         // const dn = `${username}@${domain}`;
//         // await ldapClient.bind(dn, credentials.password);

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           return null;
//         }

//         // const isPasswordValid = await compare(credentials.password, user.password);

//         // if (!isPasswordValid) {
//         //   return null;
//         // }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     jwt: async ({ token, user }) => {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     session: async ({ session, token }) => {
//       if (token) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//   },
// };

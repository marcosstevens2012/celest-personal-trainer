import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Importar el cliente de Prisma del backend
import { prisma } from "../../../backend/src/lib/prisma";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma) as any, // Commented out for custom trainer auth
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log(
            "Attempting to find trainer with email:",
            credentials.email
          );

          // Check if trainer exists in the Trainer table
          const trainer = await prisma.trainer.findUnique({
            where: { email: credentials.email },
          });

          console.log("Trainer found:", trainer ? "Yes" : "No");

          if (!trainer) {
            console.log("No trainer found with email:", credentials.email);
            return null;
          }

          // For development, use simple password check
          // In production, you should use bcrypt to compare hashed passwords
          if (credentials.password === "admin123") {
            console.log("Password correct, returning user");
            return {
              id: trainer.id,
              email: trainer.email,
              name: trainer.name,
              role: "trainer", // Set role as trainer
              image: trainer.profileImage,
            };
          } else {
            console.log("Password incorrect");
          }

          return null;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

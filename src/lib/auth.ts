import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        nik: { label: "NIK", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nik || !credentials?.password) {
          throw new Error("NIK dan Password wajib diisi");
        }

        // Cari user berdasarkan NIK (menggunakan name atau NIK jika ada di skema)
        // Saat ini di schema.prisma, "email" digunakan sebagai NIK/ID login sementara.
        // Kita akan menggunakan field "email" untuk menyimpan NIK.
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.nik,
          },
        });

        if (!user) {
          throw new Error("Pengguna tidak ditemukan");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Password salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email, // NIK
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        // Kita juga bisa memasukkan NIK (email)
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "pustaka-pangkalan-secret-key-12345",
};

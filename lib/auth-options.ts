import { db } from "@/db";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },

      // TODO: memberikan respon balik berupa toast atau notif
      // TODO: tambahkan validasi
      async authorize(credentials) {
        if (credentials !== undefined) {
          if (!credentials.username || !credentials.password) {
            return null;
          }

          const user = await db.query.users.findFirst({
            where: (users, { and, eq }) =>
              and(
                eq(users.username, credentials.username),
                eq(users.is_active, true),
              ),
          });

          if (!user) {
            console.log("pengguna tidak terdaftar");
            return null;
          }

          if (!bcrypt.compareSync(credentials.password, user.password)) {
            console.log("username atau password yang dimasukan salah");
            return null;
          }

          return {
            name: user.name,
            username: user.username,
            email: user.email,
            id: user.id.toString(),
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        delete token.picture;
        delete token.sub;

        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        delete session.user.image;

        session.user.id = token.id.toString();
        session.user.name = token.name;
      }
      return session;
    },
  },
  // useSecureCookies: process.env.NODE_ENV === "production",
};

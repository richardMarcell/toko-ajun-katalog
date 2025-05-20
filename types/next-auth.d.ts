// import { User } from "./user";

// Ambil tipe User berdasarkan skema Drizzle
// export type User = Pick<User, "id" | "email" | "name">;
export type User = {
  id: string;
  name: string;
  email: string;
};

// Jika ingin menambahkan properti tambahan, misalnya role, kamu bisa buat interface baru
// interface UserWithRole extends User {
//   id: number;
//   name: string;
// }

declare module "next-auth" {
  /* eslint-disable @typescript-eslint/no-empty-object-type */
  interface User extends User {}

  /**
   * Returned by `useSession`, `getSession` dan diterima sebagai prop di `SessionProvider`
   */
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  /* eslint-disable @typescript-eslint/no-empty-object-type */
  interface JWT extends User {}
}

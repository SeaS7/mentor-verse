import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      username?: string;
      email?: string;
      password?: string;
      role?: "admin" | "mentor" | "student"; // Enum
      isVerified?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
      username?: string;
      email?: string;
      _id?: string;
      username?: string;
      email?: string;
      password?: string;
      role?: "admin" | "mentor" | "student"; // Enum
      isVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
      username?: string;
      email?: string;
      password?: string;
      role?: "admin" | "mentor" | "student"; // Enum
      isVerified?: boolean;
  }
}

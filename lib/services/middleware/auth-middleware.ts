import { withAuth } from "next-auth/middleware";

const authMiddleware = withAuth({
  callbacks: {
    authorized: () => true,
  },
});

export default authMiddleware;

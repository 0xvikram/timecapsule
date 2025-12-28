// Prisma client singleton
// Uncomment when @prisma/client is installed and database is configured

// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;

// Placeholder export until database is configured
export const prisma = null;
export default prisma;

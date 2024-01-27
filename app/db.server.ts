import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

const prisma: PrismaClient = global.prisma || new PrismaClient();
console.log("production env proc",process.env.NODE_EN)
if (process.env.NODE_ENV !== "production") {
  console.log("production env")
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

export default prisma;

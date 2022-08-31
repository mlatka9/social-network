import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { categories } from "./data/categories";

async function main() {
  await prisma.category.createMany({
    data: categories.map((category) => ({ name: category })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

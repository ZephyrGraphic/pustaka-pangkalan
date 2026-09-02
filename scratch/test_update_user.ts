import prisma from "../src/lib/prisma";

async function main() {
  console.log("Updating cmsqzo1pl000098krs8k84qk4 to Dusun Pangkalan...");
  const updated = await prisma.user.update({
    where: { id: "cmsqzo1pl000098krs8k84qk4" },
    data: { address: "Dusun Pangkalan" },
    select: { id: true, name: true, address: true }
  });
  console.log("UPDATED RESULT:", updated);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

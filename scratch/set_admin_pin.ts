import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hash = await bcrypt.hash("123456", 10);
  const updated = await prisma.user.update({
    where: { email: "3202302703020002" },
    data: { password: hash },
    select: { id: true, name: true, email: true, role: true }
  });
  console.log("Admin PIN set to 123456 for:", updated);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import prisma from "../src/lib/prisma";

async function main() {
  console.log("Starting legacy dusun migration in database...");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, address: true },
  });

  console.log(`Found ${users.length} users. Checking addresses...`);

  for (const u of users) {
    if (!u.address) continue;

    let newAddress = u.address;
    const lower = u.address.toLowerCase();

    if (lower.includes("krajan barat") || lower.includes("dusun i") || lower.includes("dusun 1")) {
      newAddress = "Dusun Pangkalan";
    } else if (lower.includes("krajan timur") || lower.includes("dusun ii") || lower.includes("dusun 2")) {
      newAddress = "Dusun Cikajang";
    } else if (lower.includes("sukamaju") || lower.includes("dusun iii") || lower.includes("dusun 3") || lower.includes("arangan")) {
      newAddress = "Dusun Pasir Arangan";
    } else if (lower.includes("pasir angin") || lower.includes("dusun iv") || lower.includes("dusun 4") || lower.includes("gombong")) {
      newAddress = "Dusun Pasir Gombong";
    }

    if (newAddress !== u.address) {
      console.log(`Migrating user "${u.name}" (${u.id}): "${u.address}" -> "${newAddress}"`);
      await prisma.user.update({
        where: { id: u.id },
        data: { address: newAddress },
      });
    }
  }

  const updatedUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  console.log("Migration complete. Current users state:", updatedUsers);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

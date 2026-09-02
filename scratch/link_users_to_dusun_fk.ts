import prisma from "../src/lib/prisma";

async function linkUsersToDusunFK() {
  console.log("Menghubungkan user.address ke relasi foreign key user.dusunId...");
  let dusuns: any[] = [];
  for (let i = 0; i < 3; i++) {
    try {
      dusuns = await (prisma as any).dusun.findMany();
      break;
    } catch (e) {
      console.log(`Koneksi dicoba ulang (${i + 1}/3)...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.log(`Daftar Dusun terdaftar: ${dusuns.map((d: any) => `${d.name} (${d.id})`).join(", ")}`);

  const users = await prisma.user.findMany();
  console.log(`Total user yang akan diproses: ${users.length}`);

  let updatedCount = 0;
  for (const user of users) {
    if (!user.address) continue;

    // Find matching dusun
    const matchedDusun = dusuns.find((d: any) => 
      d.name.toLowerCase() === user.address!.toLowerCase() ||
      (user.address!.toLowerCase().includes("pangkalan") && d.name.toLowerCase().includes("pangkalan")) ||
      (user.address!.toLowerCase().includes("cikajang") && d.name.toLowerCase().includes("cikajang")) ||
      (user.address!.toLowerCase().includes("pasir arangan") && d.name.toLowerCase().includes("arangan")) ||
      (user.address!.toLowerCase().includes("pasir gombong") && d.name.toLowerCase().includes("gombong"))
    );

    if (matchedDusun) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          dusunId: matchedDusun.id,
          address: matchedDusun.name,
        }
      });
      console.log(`User ${user.name} (${user.email}) -> linked to ${matchedDusun.name} [${matchedDusun.id}]`);
      updatedCount++;
    } else {
      console.log(`User ${user.name} (${user.email}) address '${user.address}' tidak cocok dengan dusun desa (mungkin Tamu/Luar).`);
    }
  }

  console.log(`\nSelesai! ${updatedCount} pengguna berhasil dihubungkan ke foreign key Dusun.`);
}

linkUsersToDusunFK()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

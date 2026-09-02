import prisma from "../src/lib/prisma";

const DEFAULT_CATEGORIES = [
  {
    name: "Pertanian & Ketahanan Pangan",
    slug: "pertanian",
    icon: "Sprout",
    order: 1,
    description: "Teknologi budidaya padi organik, hidroponik, bioflok nila, dan pupuk kompos desa.",
  },
  {
    name: "Sejarah, Budaya & Bahasa Sunda",
    slug: "sejarah-sunda",
    icon: "Landmark",
    order: 2,
    description: "Babad Desa Pangkalan, aksara Sunda kuno, paribasa, dan kearifan lokal tanah Sunda.",
  },
  {
    name: "Bisnis Desa, UMKM & BUMDes",
    slug: "bisnis-umkm",
    icon: "TrendingUp",
    order: 3,
    description: "Strategi permodalan, pembukuan keuangan, dan pemasaran digital produk desa.",
  },
  {
    name: "Kesehatan & Gizi Keluarga",
    slug: "kesehatan",
    icon: "HeartPulse",
    order: 4,
    description: "Pencegahan stunting, pemanfaatan tanaman obat keluarga (TOGA), dan sanitasi lingkungan.",
  },
  {
    name: "Teknologi, AI & Digital Desa",
    slug: "teknologi-ai",
    icon: "Cpu",
    order: 5,
    description: "Pengenalan komputer, internet aman, dan pemanfaatan kecerdasan buatan untuk warga.",
  },
  {
    name: "Pendidikan & Cerita Anak",
    slug: "pendidikan-anak",
    icon: "GraduationCap",
    order: 6,
    description: "Kumpulan dongeng bergambar nusantara, fabel moral, dan pengenalan sains dasar.",
  },
  {
    name: "Keterampilan & Industri Kreatif",
    slug: "keterampilan",
    icon: "Palette",
    order: 7,
    description: "Kerajinan anyaman bambu, daur ulang limbah pertanian, dan kreasi kuliner lokal.",
  },
  {
    name: "Agama & Budi Pekerti",
    slug: "agama-akhlak",
    icon: "BookOpen",
    order: 8,
    description: "Tuntunan ibadah, akhlak mulia, kerukunan sosial, dan tradisi gotong royong warga.",
  },
];

async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }
  throw lastError;
}

async function seedCategories() {
  console.log("Seeding expanded categories into database...");

  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await executeWithRetry<any>(() =>
      (prisma as any).category.findFirst({
        where: {
          OR: [
            { name: cat.name },
            { slug: cat.slug }
          ]
        }
      })
    );

    if (!existing) {
      const created = await executeWithRetry<any>(() =>
        (prisma as any).category.create({ data: cat })
      );
      console.log(`Created category: ${created.name}`);
    } else {
      await executeWithRetry(() =>
        (prisma as any).category.update({
          where: { id: existing.id },
          data: {
            icon: cat.icon,
            order: cat.order,
            description: cat.description,
          },
        })
      );
      console.log(`Updated category: ${existing.name}`);
    }
  }

  // Link existing books to new categories
  const books = await executeWithRetry<any[]>(() => prisma.book.findMany());
  const allCats = await executeWithRetry<any[]>(() => (prisma as any).category.findMany());

  for (const book of books) {
    let targetCat = allCats.find((c: any) => c.name === book.category);
    if (!targetCat) {
      const lower = book.category.toLowerCase();
      if (lower.includes("tani") || lower.includes("pertanian") || lower.includes("bioflok")) {
        targetCat = allCats.find((c: any) => c.slug === "pertanian");
      } else if (lower.includes("sejarah") || lower.includes("sunda") || lower.includes("aksara")) {
        targetCat = allCats.find((c: any) => c.slug === "sejarah-sunda");
      } else if (lower.includes("ekonomi") || lower.includes("bisnis") || lower.includes("bumdes")) {
        targetCat = allCats.find((c: any) => c.slug === "bisnis-umkm");
      } else if (lower.includes("sehat") || lower.includes("kesehatan")) {
        targetCat = allCats.find((c: any) => c.slug === "kesehatan");
      }
    }

    if (targetCat) {
      await executeWithRetry(() =>
        prisma.book.update({
          where: { id: book.id },
          data: {
            category: targetCat.name,
            categoryId: targetCat.id,
          },
        })
      );
      console.log(`Linked book "${book.title}" -> ${targetCat.name}`);
    }
  }

  console.log("Seeding categories finished successfully!");
}

seedCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

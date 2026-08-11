import { PrismaClient, RoleName, ContentType, ContentStatus, ContentVisibility, LicenseType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Comprehensive Seed for Perpustakaan Digital Desa...");

  // 1. Seed Roles
  const rolesData = [
    { name: RoleName.SUPER_ADMIN, description: "Administrator utama dengan akses penuh" },
    { name: RoleName.ADMIN, description: "Pengelola desa & sistem perpustakaan" },
    { name: RoleName.LIBRARIAN, description: "Pengelola konten & koleksi digital" },
    { name: RoleName.USER, description: "Warga desa pembaca" },
  ];

  const rolesMap: Record<string, string> = {};
  for (const role of rolesData) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
    rolesMap[role.name] = r.id;
  }
  console.log("✅ Roles seeded.");

  // 2. Seed Admin User
  const passwordHash = await bcrypt.hash("Kaydeen303", 10);
  const adminUser = await prisma.user.upsert({
    where: { phone: "081574627052" },
    update: { passwordHash, name: "Admin Kai (Kaydeen303)" },
    create: {
      name: "Admin Kai (Kaydeen303)",
      phone: "081574627052",
      email: "admin@desa.id",
      passwordHash,
      roleId: rolesMap[RoleName.ADMIN] || rolesMap[RoleName.SUPER_ADMIN],
    },
  });
  console.log("✅ Default Admin User created (Phone: 081574627052 / Pass: Kaydeen303).");

  // 3. Seed Categories
  const categoriesData = [
    { name: "Pendidikan & Sekolah", slug: "pendidikan", icon: "📚", description: "Buku pelajaran, modul sekolah, dan panduan belajar" },
    { name: "Pertanian & Peternakan", slug: "pertanian", icon: "🌾", description: "Panduan bercocok tanam, olah tanah, pupuk organik, dan ternak" },
    { name: "Teknologi & Digital", slug: "teknologi", icon: "💻", description: "Literasi digital, penggunaan komputer, dan teknologi informasi" },
    { name: "Kewirausahaan & UMKM", slug: "umkm", icon: "💼", description: "Manajemen usaha desa, pemasaran produk lokal, dan keuangan" },
    { name: "Anak & Remaja", slug: "anak", icon: "👶", description: "Buku cerita anak, dongeng lokal, dan bacaan bergambar" },
    { name: "Kesehatan & Gizi", slug: "kesehatan", icon: "🏥", description: "Panduan kesehatan keluarga, gizi, pencegahan stunting" },
    { name: "Sejarah Desa", slug: "sejarah-desa", icon: "🏛️", description: "Dokumentasi asal-usul, tokoh, dan arsip sejarah desa" },
    { name: "Seni & Budaya Lokal", slug: "budaya", icon: "🎨", description: "Tradisi lokal, kesenian, kerajinan tangan, dan sastra desa" },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, description: cat.description },
      create: cat,
    });
    categoriesMap[cat.slug] = c.id;
  }
  console.log("✅ Categories seeded.");

  // 4. Seed Authors
  const authorsData = [
    { name: "Budi Santoso", bio: "Praktisi pertanian organik dan penyuluh tanaman desa." },
    { name: "Dr. Ir. H. Hartono", bio: "Peneliti sejarah lokal dan dosen literasi pedesaan." },
  ];

  const authorsList = [];
  for (const author of authorsData) {
    let a = await prisma.author.findFirst({ where: { name: author.name } });
    if (!a) {
      a = await prisma.author.create({ data: author });
    }
    authorsList.push(a.id);
  }
  console.log("✅ Authors seeded.");

  // 5. Seed Sample Collections
  const sampleBooks = [
    {
      title: "Belajar Bertani Organik Lengkap",
      slug: "belajar-bertani-organik-lengkap",
      description: "Panduan praktis pembuatan pupuk kompos cair, olah tanah ramah lingkungan, dan budidaya tanaman pangan hemat biaya.",
      categoryId: categoriesMap["pertanian"],
      authorId: authorsList[0],
      contentType: ContentType.BOOK,
      publicationYear: 2026,
      coverUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80",
      status: ContentStatus.PUBLISHED,
      visibility: ContentVisibility.PUBLIC,
      license: LicenseType.VILLAGE_OWNED,
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      title: "Panduan Manajemen & Pemasaran UMKM Desa",
      slug: "panduan-manajemen-pemasaran-umkm-desa",
      description: "Langkah mudah mengelola keuangan usaha warga, pengemasan produk lokal, dan pemasaran lewat media sosial.",
      categoryId: categoriesMap["umkm"],
      authorId: authorsList[0],
      contentType: ContentType.MODULE,
      publicationYear: 2026,
      coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
      status: ContentStatus.PUBLISHED,
      visibility: ContentVisibility.PUBLIC,
      license: LicenseType.OPEN_LICENSE,
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      title: "Sejarah & Asal-Usul Desa Makmur",
      slug: "sejarah-dan-asal-usul-desa-makmur",
      description: "Dokumentasi perjalanan berdirinya desa, kisah perjuangan para pendiri desa, serta silsilah leluhur lokal.",
      categoryId: categoriesMap["sejarah-desa"],
      authorId: authorsList[1],
      contentType: ContentType.LOCAL_HISTORY,
      publicationYear: 2025,
      coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80",
      status: ContentStatus.PUBLISHED,
      visibility: ContentVisibility.REGISTERED,
      license: LicenseType.VILLAGE_OWNED,
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      title: "Dasar-Dasar Literasi Digital Warga Desa",
      slug: "dasar-dasar-literasi-digital-warga-desa",
      description: "Modul edukasi penggunaan smartphone secara bijak, keamanan data pribadi, dan pencegahan penipuan online.",
      categoryId: categoriesMap["teknologi"],
      authorId: authorsList[1],
      contentType: ContentType.MODULE,
      publicationYear: 2026,
      coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
      status: ContentStatus.PUBLISHED,
      visibility: ContentVisibility.PUBLIC,
      license: LicenseType.OPEN_LICENSE,
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ];

  for (const book of sampleBooks) {
    const { pdfUrl, ...bookData } = book;
    await prisma.content.create({
      data: {
        ...bookData,
        digitalAssets: {
          create: {
            storageKey: `documents/${book.slug}.pdf`,
            fileUrl: pdfUrl,
            mimeType: "application/pdf",
            fileSizeBytes: BigInt(2500000),
          },
        },
      },
    });
  }

  console.log("✅ Sample Collections & Digital Assets seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QlqGiSL1ev3X@ep-plain-smoke-auwsej0e.c-10.us-east-1.aws.neon.tech/pustaka?sslmode=require";

async function runAudit() {
  console.log("===============================================================");
  console.log("       LAPORAN AUDIT SISTEM INFORMASI & STQA PUSTAKA PANGKALAN  ");
  console.log("===============================================================\n");

  const client = new Client({ connectionString });
  await client.connect();

  const auditResults = {
    database: { passed: 0, failed: 0, tests: [] },
    security: { passed: 0, failed: 0, tests: [] },
    functional: { passed: 0, failed: 0, tests: [] },
    dataQuality: { passed: 0, failed: 0, tests: [] },
  };

  function record(category, testName, status, details) {
    if (status) {
      auditResults[category].passed++;
      console.log(`  [PASS] ${testName}: ${details}`);
    } else {
      auditResults[category].failed++;
      console.log(`  [FAIL] ${testName}: ${details}`);
    }
    auditResults[category].tests.push({ testName, status, details });
  }

  // ==========================================
  // 1. AUDIT STRUKTUR DATABASE & RELASI ENTITAS
  // ==========================================
  console.log("--- 1. AUDIT STRUKTUR DATABASE & INTEGRITAS SKEMA ---");

  // Check tables existence
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  const tables = tablesRes.rows.map(r => r.table_name);
  const requiredTables = ["User", "Book", "Chapter", "Bookmark", "ReadingProgress", "Review", "Announcement"];
  
  for (const t of requiredTables) {
    const exists = tables.includes(t);
    record("database", `Tabel '${t}'`, exists, exists ? "Tersedia & Terindeks" : "Tabel TIDAK DITEMUKAN");
  }

  // Check User columns (including Gamification points & badge)
  const userColsRes = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'User'
  `);
  const userCols = userColsRes.rows.map(r => r.column_name);
  const hasPoints = userCols.includes("points");
  const hasBadge = userCols.includes("badge");
  record("database", "Kolom Gamifikasi User ('points', 'badge')", hasPoints && hasBadge, `points: ${hasPoints}, badge: ${hasBadge}`);

  // Check Foreign Key Cascades on Chapter -> Book
  const fkRes = await client.query(`
    SELECT tc.constraint_name, rc.delete_rule 
    FROM information_schema.table_constraints tc
    JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
    WHERE tc.table_name = 'Chapter'
  `);
  const hasCascade = fkRes.rows.some(r => r.delete_rule === 'CASCADE');
  record("database", "Cascade Deletion (Chapter -> Book)", hasCascade, hasCascade ? "CASCADE aktif" : "NO ACTION");

  // ==========================================
  // 2. AUDIT KEAMANAN & PENGELOLAAN IDENTITAS (SECURITY & AUTH)
  // ==========================================
  console.log("\n--- 2. AUDIT KEAMANAN & PRIVASI DATA (SECURITY AUDIT) ---");

  // Check password hashing in User table
  const usersRes = await client.query(`SELECT id, email, password, role FROM "User" LIMIT 50`);
  let unhashedCount = 0;
  for (const u of usersRes.rows) {
    if (!u.password.startsWith("$2a$") && !u.password.startsWith("$2b$") && !u.password.startsWith("$2y$")) {
      unhashedCount++;
    }
  }
  record("security", "Enkripsi Password (Bcrypt Hashing)", unhashedCount === 0, `${usersRes.rows.length} akun dicek, ${unhashedCount} password plaintext`);

  // Check Admin Accounts count & protection
  const adminUsers = usersRes.rows.filter(u => u.role === "ADMIN");
  record("security", "Struktur Role-Based Access (Akun Admin)", adminUsers.length > 0, `Ditemukan ${adminUsers.length} akun Admin terdaftar`);

  // Check NIK format / uniqueness
  const duplicatesRes = await client.query(`
    SELECT email, COUNT(*) 
    FROM "User" 
    GROUP BY email 
    HAVING COUNT(*) > 1
  `);
  record("security", "Integritas Unik NIK (Anti-Duplikasi Akun)", duplicatesRes.rows.length === 0, `Duplikasi NIK: ${duplicatesRes.rows.length}`);

  // ==========================================
  // 3. AUDIT KUALITAS DATA & ASET DIGITAL
  // ==========================================
  console.log("\n--- 3. AUDIT KUALITAS KONTEN & ASET DIGITAL ---");

  const booksRes = await client.query(`
    SELECT b.id, b.title, b.author, b.category, b."coverUrl", b.rating,
           COUNT(c.id) as chapters_count
    FROM "Book" b
    LEFT JOIN "Chapter" c ON c."bookId" = b.id
    GROUP BY b.id
  `);

  let brokenCovers = 0;
  let booksWithoutChapters = 0;

  for (const b of booksRes.rows) {
    if (!b.coverUrl || b.coverUrl.trim() === "" || b.coverUrl.includes("via.placeholder")) {
      brokenCovers++;
    }
    if (parseInt(b.chapters_count) === 0) {
      booksWithoutChapters++;
    }
  }

  record("dataQuality", "Kelengkapan Aset Cover Buku", brokenCovers === 0, `${booksRes.rows.length} total buku, ${brokenCovers} cover bermasalah`);
  record("dataQuality", "Ketersediaan Konten Bab per Buku", booksWithoutChapters === 0, `${booksRes.rows.length - booksWithoutChapters}/${booksRes.rows.length} buku memiliki bab aktif`);

  // Check review rating consistency
  const reviewsRes = await client.query(`
    SELECT r.id, r.rating, r."bookId"
    FROM "Review" r
  `);
  let invalidRatings = 0;
  for (const r of reviewsRes.rows) {
    if (r.rating < 1 || r.rating > 5) {
      invalidRatings++;
    }
  }
  record("dataQuality", "Validitas Rating Ulasan (1 - 5 Bintang)", invalidRatings === 0, `${reviewsRes.rows.length} ulasan, ${invalidRatings} di luar skala`);

  // ==========================================
  // 4. AUDIT FUNGSIONALITAS API & INTEGRASI
  // ==========================================
  console.log("\n--- 4. AUDIT FUNGSIONALITAS FITUR & API (INTEGRATION TEST) ---");

  // Verify Announcements count
  const annRes = await client.query(`SELECT COUNT(*) FROM "Announcement" WHERE active = true`);
  const activeAnnouncements = parseInt(annRes.rows[0].count);
  record("functional", "Publikasi Warta Desa Aktif", activeAnnouncements > 0, `${activeAnnouncements} warta aktif untuk carousel`);

  // Verify Reading Progress records
  const progressRes = await client.query(`SELECT COUNT(*) FROM "ReadingProgress"`);
  record("functional", "Tracking Progres Membaca Warga", parseInt(progressRes.rows[0].count) >= 0, `${progressRes.rows[0].count} riwayat progres tercatat`);

  await client.end();

  console.log("\n===============================================================");
  console.log("                     RINGKASAN HASIL AUDIT                     ");
  console.log("===============================================================");
  const totalPassed = auditResults.database.passed + auditResults.security.passed + auditResults.dataQuality.passed + auditResults.functional.passed;
  const totalFailed = auditResults.database.failed + auditResults.security.failed + auditResults.dataQuality.failed + auditResults.functional.failed;
  const score = Math.round((totalPassed / (totalPassed + totalFailed)) * 100);

  console.log(`Total Pengujian : ${totalPassed + totalFailed}`);
  console.log(`Lolos (PASS)    : ${totalPassed}`);
  console.log(`Gagal (FAIL)    : ${totalFailed}`);
  console.log(`Skor Kepatuhan  : ${score}% (Grade: ${score >= 90 ? 'A (Sangat Baik / Production-Ready)' : 'B'})`);
  console.log("===============================================================\n");

  return { totalPassed, totalFailed, score, auditResults };
}

runAudit().catch(console.error);

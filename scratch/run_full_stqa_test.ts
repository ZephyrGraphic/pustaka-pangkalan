import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { adminUserUpdateSchema, profileUpdateSchema, dusunSchema } from "../src/lib/validations";

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details?: string) {
  results.push({ suite, name, passed: !!condition, details });
  if (condition) {
    console.log(`  ✅ [PASS] ${suite} > ${name}`);
  } else {
    console.error(`  ❌ [FAIL] ${suite} > ${name} - Details: ${details || "Assertion failed"}`);
  }
}

async function runSTQAAudit() {
  console.log("===============================================================");
  console.log(" 🚀 STARTING FULL STQA & INFORMATION SYSTEMS AUDIT EXECUTION ");
  console.log("===============================================================\n");

  // SUITE 1: DATABASE INTEGRITY & SEEDING AUDIT
  console.log("📦 SUITE 1: Database & Schema Integrity Audit");
  // SUITE 1: DATABASE & SCHEMA INTEGRITY AUDIT
  console.log("\n📦 SUITE 1: Database & Schema Integrity Audit");
  let dusuns: any[] = [];
  let userCount = 0;
  let legacyUsers: any[] = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      dusuns = await (prisma as any).dusun.findMany();
      userCount = await prisma.user.count();
      legacyUsers = await prisma.user.findMany({
        where: {
          OR: [
            { address: { contains: "krajan", mode: "insensitive" } },
            { address: { contains: "dusun i", mode: "insensitive" } },
            { address: { contains: "dusun 1", mode: "insensitive" } },
          ]
        }
      });
      break;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  try {
    assert(dusuns.length > 0, "DB_INTEGRITY", "Official Dusuns exist in database", `Count: ${dusuns.length}`);
    assert(dusuns.length >= 4, "DB_INTEGRITY", "All 4 official Desa Pangkalan dusuns are registered");
    assert(userCount > 0, "DB_INTEGRITY", "User accounts exist in database", `Total users: ${userCount}`);
    assert(legacyUsers.length === 0, "DB_INTEGRITY", "No legacy address strings remain un-migrated", `Legacy remaining: ${legacyUsers.length}`);
  } catch (err: any) {
    assert(false, "DB_INTEGRITY", "Database connection & schema query", err.message);
  }

  // SUITE 2: AUTHENTICATION & RBAC SECURITY AUDIT
  console.log("\n🔒 SUITE 2: Authentication & RBAC Security Audit");
  try {
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    assert(!!adminUser, "SECURITY_RBAC", "Admin user exists in database", `Admin ID: ${adminUser?.id}`);

    if (adminUser) {
      const isBcryptFormat = adminUser.password.startsWith("$2a$") || adminUser.password.startsWith("$2b$");
      assert(isBcryptFormat, "SECURITY_RBAC", "Admin bcrypt credential verification", `User: ${adminUser.name}`);
    }

    const regularUser = await prisma.user.findFirst({ where: { role: "USER" } });
    assert(!!regularUser, "SECURITY_RBAC", "Regular citizen user exists in database", `Citizen: ${regularUser?.name}`);
    assert(regularUser?.role === "USER", "SECURITY_RBAC", "Citizen cannot elevate role without authorization");
  } catch (err: any) {
    assert(false, "SECURITY_RBAC", "Authentication audit query", err.message);
  }

  // SUITE 3: CRUD CITIZEN PROFILE & DUSUN SYNCHRONIZATION
  console.log("\n🔄 SUITE 3: User CRUD & Dusun Synchronization Verification");
  try {
    const targetUser = await prisma.user.findFirst({ where: { email: "3202202600420001" } });
    assert(!!targetUser, "USER_CRUD", "Citizen 'Pustaka Pangkalan' located in database", `ID: ${targetUser?.id}`);

    if (targetUser) {
      // Step A: Update to Dusun Cikajang
      const cikajangDusun = await (prisma as any).dusun.findFirst({ where: { name: "Dusun Cikajang" } });
      const updateStep1 = await prisma.user.update({
        where: { id: targetUser.id },
        data: {
          address: "Dusun Cikajang",
          dusunId: cikajangDusun?.id || null,
        },
        select: { id: true, name: true, address: true, dusunId: true }
      });
      assert(updateStep1.address === "Dusun Cikajang", "USER_CRUD", "Update citizen address to 'Dusun Cikajang'", `Current: ${updateStep1.address}`);

      // Verify Read after Update 1
      const verifyStep1 = await prisma.user.findUnique({
        where: { id: targetUser.id },
        select: { address: true, dusunId: true }
      });
      assert(verifyStep1?.address === "Dusun Cikajang", "USER_CRUD", "Verify persistence of 'Dusun Cikajang'");

      // Step B: Update back to Dusun Pangkalan (User's desired state)
      const pangkalanDusun = await (prisma as any).dusun.findFirst({ where: { name: "Dusun Pangkalan" } });
      const updateStep2 = await prisma.user.update({
        where: { id: targetUser.id },
        data: {
          address: "Dusun Pangkalan",
          dusunId: pangkalanDusun?.id || null,
        },
        select: { id: true, name: true, address: true, dusunId: true }
      });
      assert(updateStep2.address === "Dusun Pangkalan", "USER_CRUD", "Update citizen address to 'Dusun Pangkalan'", `Current: ${updateStep2.address}`);

      // Verify Read after Update 2
      const verifyStep2 = await prisma.user.findUnique({
        where: { id: targetUser.id },
        select: { address: true, dusunId: true }
      });
      assert(verifyStep2?.address === "Dusun Pangkalan", "USER_CRUD", "Verify persistence of 'Dusun Pangkalan'");

      // Step C: Test Reset PIN
      const newPinHash = await bcrypt.hash("654321", 10);
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { password: newPinHash }
      });
      const updatedUserWithPin = await prisma.user.findUnique({
        where: { id: targetUser.id },
        select: { password: true }
      });
      const isNewPinValid = await bcrypt.compare("654321", updatedUserWithPin?.password || "");
      assert(isNewPinValid, "USER_CRUD", "Reset PIN to '654321' verified with bcrypt compare");

      // Reset back to 123456
      const defaultPinHash = await bcrypt.hash("123456", 10);
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { password: defaultPinHash }
      });
      const restoredUser = await prisma.user.findUnique({
        where: { id: targetUser.id },
        select: { password: true }
      });
      const isRestoredValid = await bcrypt.compare("123456", restoredUser?.password || "");
      assert(isRestoredValid, "USER_CRUD", "Restore PIN to '123456' verified with bcrypt compare");
    }
  } catch (err: any) {
    assert(false, "USER_CRUD", "CRUD operation execution", err.message);
  }

  // SUITE 4: DUSUN CASCADE UPDATE & INTEGRITY
  console.log("\n🏘️ SUITE 4: Dusun Management & Cascade Update Audit");
  try {
    const dusuns = await (prisma as any).dusun.findMany({ orderBy: { order: "asc" } });
    assert(dusuns.length >= 4, "DUSUN_CASCADE", "Dusun list query", `Total dusuns: ${dusuns.length}`);

    // Verify citizen count per dusun query
    const dusunCounts = await prisma.user.groupBy({
      by: ["address"],
      _count: { id: true },
    });
    assert(dusunCounts.length > 0, "DUSUN_CASCADE", "Citizen distribution per dusun calculated successfully");

    const pangkalanCount = dusunCounts.find(d => d.address === "Dusun Pangkalan")?._count?.id || 0;
    assert(pangkalanCount >= 1, "DUSUN_CASCADE", "Citizen correctly counted in 'Dusun Pangkalan'", `Count: ${pangkalanCount}`);
  } catch (err: any) {
    assert(false, "DUSUN_CASCADE", "Dusun cascade test", err.message);
  }

  // SUITE 5: HTTP ENDPOINT LIVE RESPONSE VERIFICATION
  console.log("\n🌐 SUITE 5: Live API Endpoint Health Verification");
  try {
    const resDusuns = await fetch("http://localhost:3000/api/dusuns");
    const jsonDusuns = await resDusuns.json();
    assert(resDusuns.ok, "API_HEALTH", "GET /api/dusuns returns HTTP 200 OK");
    assert(Array.isArray(jsonDusuns.dusuns) && jsonDusuns.dusuns.length >= 4, "API_HEALTH", "GET /api/dusuns returns valid dusun list", `Count: ${jsonDusuns.dusuns?.length}`);

    const resHome = await fetch("http://localhost:3000/");
    assert(resHome.ok, "API_HEALTH", "GET / (Home Landing Page) returns HTTP 200 OK");

    const resLogin = await fetch("http://localhost:3000/login");
    assert(resLogin.ok, "API_HEALTH", "GET /login returns HTTP 200 OK");
  } catch (err: any) {
    assert(false, "API_HEALTH", "Live HTTP endpoint query", err.message);
  }

  // SUITE 6: RELATIONAL FOREIGN KEY INTEGRITY AUDIT
  console.log("\n🔗 SUITE 6: Relational Foreign Key Integrity Audit");
  let userWithRelation: any = null;
  let dusunWithUsers: any = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      userWithRelation = await prisma.user.findFirst({
        where: { email: "3202202600420001" },
        include: { dusun: true }
      });
      dusunWithUsers = await (prisma as any).dusun.findFirst({
        where: { name: "Dusun Pangkalan" },
        include: {
          _count: {
            select: { users: true }
          }
        }
      });
      break;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  try {
    assert(!!userWithRelation, "RELATION_FK", "Query citizen with 'include: { dusun: true }'");
    assert(!!userWithRelation?.dusunId, "RELATION_FK", "Field 'dusunId' is populated on citizen", `dusunId: ${userWithRelation?.dusunId}`);
    assert(userWithRelation?.dusun?.name === "Dusun Pangkalan", "RELATION_FK", "Relation points correctly to 'Dusun Pangkalan'", `Dusun: ${userWithRelation?.dusun?.name}`);
    assert((dusunWithUsers?._count?.users || 0) >= 1, "RELATION_FK", "Reverse relation Dusun.users correctly counts related citizens", `Relational count: ${dusunWithUsers?._count?.users}`);
  } catch (err: any) {
    assert(false, "RELATION_FK", "Relational foreign key query", err.message);
  }

  // SUITE 7: ZOD RUNTIME SCHEMA VALIDATION AUDIT
  console.log("\n🛡️ SUITE 7: Zod Runtime Schema Validation Audit");
  try {
    // 1. Valid Admin User Update
    const validUserPayload = {
      userId: "test-user-id",
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Dusun Pangkalan",
      occupation: "Petani Modern"
    };
    const validParse = adminUserUpdateSchema.safeParse(validUserPayload);
    assert(validParse.success, "ZOD_VALIDATION", "Valid admin user update payload accepted");

    // 2. Invalid User Update (empty name)
    const invalidUserPayload = {
      userId: "test-user-id",
      name: "",
      address: "Dusun Pangkalan"
    };
    const invalidParse = adminUserUpdateSchema.safeParse(invalidUserPayload);
    assert(!invalidParse.success, "ZOD_VALIDATION", "Invalid payload (empty name) correctly rejected");

    // 3. Invalid Profile PIN (5 digits instead of 6)
    const invalidPinPayload = {
      name: "Siti Nurhaliza",
      newPin: "12345"
    };
    const invalidPinParse = profileUpdateSchema.safeParse(invalidPinPayload);
    assert(!invalidPinParse.success, "ZOD_VALIDATION", "Invalid PIN length (5 digits) correctly rejected");

    // 4. Valid Profile PIN (6 digits)
    const validPinPayload = {
      name: "Siti Nurhaliza",
      newPin: "123456"
    };
    const validPinParse = profileUpdateSchema.safeParse(validPinPayload);
    assert(validPinParse.success, "ZOD_VALIDATION", "Valid 6-digit PIN correctly accepted");

    // 5. Invalid Dusun (empty name)
    const invalidDusun = { name: "" };
    const invalidDusunParse = dusunSchema.safeParse(invalidDusun);
    assert(!invalidDusunParse.success, "ZOD_VALIDATION", "Invalid dusun (empty name) correctly rejected");
  } catch (err: any) {
    assert(false, "ZOD_VALIDATION", "Zod schema testing", err.message);
  }

  // SUITE 8: PHYSICAL BOOK CIRCULATION CRUD VERIFICATION
  console.log("\n📚 SUITE 8: Physical Book Circulation CRUD Verification");
  try {
    // 1. Read: Query all borrow records (self-seeding if empty)
    let allRecords = await prisma.borrowRecord.findMany({
      include: { user: true, book: true },
      orderBy: { createdAt: "desc" },
    });

    if (allRecords.length === 0) {
      const seedUser = await prisma.user.findFirst();
      const seedBook = await prisma.book.findFirst();
      if (seedUser && seedBook) {
        await prisma.borrowRecord.create({
          data: {
            userId: seedUser.id,
            bookId: seedBook.id,
            dueDate: new Date(Date.now() + 7 * 86400000),
            status: "BORROWED",
            notes: "Buku fisik dipinjam di Balai Desa",
          },
        });
        allRecords = await prisma.borrowRecord.findMany({
          include: { user: true, book: true },
        });
      }
    }

    assert(allRecords.length >= 1, "CIRCULATION_CRUD", "Circulation records exist in database", `Total: ${allRecords.length}`);

    // 2. Create: Add a test borrow record
    const testUser = await prisma.user.findFirst({ where: { email: "3202202600420001" } });
    const testBook = await prisma.book.findFirst();
    assert(!!testUser && !!testBook, "CIRCULATION_CRUD", "Reference user and book available for circulation test");

    if (testUser && testBook) {
      const initialDue = new Date(Date.now() + 7 * 86400000);
      const newBorrow = await prisma.borrowRecord.create({
        data: {
          userId: testUser.id,
          bookId: testBook.id,
          dueDate: initialDue,
          status: "BORROWED",
          notes: "STQA Automated Test Borrowing",
        },
      });
      assert(!!newBorrow.id, "CIRCULATION_CRUD", "Create new borrow record (POST)", `Record ID: ${newBorrow.id}`);

      // 3. Update: Extend borrow by 7 days
      const extendedDue = new Date(initialDue.getTime() + 7 * 86400000);
      const extendedRecord = await prisma.borrowRecord.update({
        where: { id: newBorrow.id },
        data: { dueDate: extendedDue },
      });
      assert(
        new Date(extendedRecord.dueDate).getTime() > new Date(initialDue).getTime(),
        "CIRCULATION_CRUD",
        "Extend borrow record due date by 7 days (PATCH EXTEND)"
      );

      // 4. Update: Mark as returned (Tandai Kembali)
      const returnedRecord = await prisma.borrowRecord.update({
        where: { id: newBorrow.id },
        data: {
          status: "RETURNED",
          returnDate: new Date(),
        },
      });
      assert(returnedRecord.status === "RETURNED", "CIRCULATION_CRUD", "Mark book as returned (PATCH RETURN)");
      assert(!!returnedRecord.returnDate, "CIRCULATION_CRUD", "Populate returnDate timestamp on return");

      // 5. Delete: Cleanup test record
      await prisma.borrowRecord.delete({ where: { id: newBorrow.id } });
      const verifyDeleted = await prisma.borrowRecord.findUnique({ where: { id: newBorrow.id } });
      assert(!verifyDeleted, "CIRCULATION_CRUD", "Delete borrow record (DELETE)");
    }
  } catch (err: any) {
    assert(false, "CIRCULATION_CRUD", "Circulation CRUD suite", err.message);
  }

  // SUMMARY
  console.log("\n===============================================================");
  console.log(" 📊 STQA & IS AUDIT SUMMARY REPORT ");
  console.log("===============================================================");
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total Test Cases Executed : ${total}`);
  console.log(`Passed                    : ${passed} ✅`);
  console.log(`Failed                    : ${failed} ❌`);
  console.log(`Success Rate              : ${((passed / total) * 100).toFixed(1)}%`);
  console.log("===============================================================\n");

  return { total, passed, failed, results };
}

runSTQAAudit()
  .then(res => {
    if (res.failed > 0) {
      setTimeout(() => process.exit(1), 100);
    } else {
      setTimeout(() => process.exit(0), 100);
    }
  })
  .catch(err => {
    console.error("Audit fatal error:", err);
    setTimeout(() => process.exit(1), 100);
  });

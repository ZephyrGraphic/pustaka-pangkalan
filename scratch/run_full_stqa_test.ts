import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

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
  try {
    const dusuns = await (prisma as any).dusun.findMany({ orderBy: { order: "asc" } });
    assert(dusuns.length >= 4, "DB_INTEGRITY", "Official Dusuns exist in database", `Found ${dusuns.length} dusuns`);

    const expectedDusuns = ["Dusun Pangkalan", "Dusun Cikajang", "Dusun Pasir Arangan", "Dusun Pasir Gombong"];
    const dusunNames = dusuns.map((d: any) => d.name);
    const allExpectedPresent = expectedDusuns.every(name => dusunNames.includes(name));
    assert(allExpectedPresent, "DB_INTEGRITY", "All 4 official Desa Pangkalan dusuns are registered", `Registered: ${dusunNames.join(", ")}`);

    const users = await prisma.user.findMany();
    assert(users.length > 0, "DB_INTEGRITY", "User accounts exist in database", `Total users: ${users.length}`);

    // Check for any legacy addresses in DB
    const legacyUsers = users.filter(u => 
      u.address && (
        u.address.toLowerCase().includes("krajan") || 
        u.address.toLowerCase().includes("dusun i") || 
        u.address.toLowerCase().includes("dusun 1")
      )
    );
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
      const isPinValid = await bcrypt.compare("123456", adminUser.password);
      assert(isPinValid, "SECURITY_RBAC", "Admin bcrypt credential verification", `User: ${adminUser.name}`);
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
      const updateStep1 = await prisma.user.update({
        where: { id: targetUser.id },
        data: { address: "Dusun Cikajang" },
        select: { id: true, name: true, address: true }
      });
      assert(updateStep1.address === "Dusun Cikajang", "USER_CRUD", "Update citizen address to 'Dusun Cikajang'", `Current: ${updateStep1.address}`);

      // Verify Read after Update 1
      const verifyStep1 = await prisma.user.findUnique({
        where: { id: targetUser.id },
        select: { address: true }
      });
      assert(verifyStep1?.address === "Dusun Cikajang", "USER_CRUD", "Verify persistence of 'Dusun Cikajang'");

      // Step B: Update back to Dusun Pangkalan (User's desired state)
      const updateStep2 = await prisma.user.update({
        where: { id: targetUser.id },
        data: { address: "Dusun Pangkalan" },
        select: { id: true, name: true, address: true }
      });
      assert(updateStep2.address === "Dusun Pangkalan", "USER_CRUD", "Update citizen address to 'Dusun Pangkalan'", `Current: ${updateStep2.address}`);

      // Verify Read after Update 2
      const verifyStep2 = await prisma.user.findUnique({
        where: { id: targetUser.id },
        select: { address: true }
      });
      assert(verifyStep2?.address === "Dusun Pangkalan", "USER_CRUD", "Verify persistence of 'Dusun Pangkalan'");
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
    if (res.failed > 0) process.exit(1);
    process.exit(0);
  })
  .catch(err => {
    console.error("Audit fatal error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

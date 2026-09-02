/**
 * Seeds the two tenant baseline required by section 6 of WORLD_CLASS_APP_THESIS.md and by
 * the OWASP authorization regression testing approach: two organizations, data in each, and
 * users at different roles, so a cross tenant read has something real to fail on.
 *
 * Run: npm run db:seed:test
 * IDs are deterministic so tests can reference them without a lookup round trip.
 */
import { PrismaClient, Role, UserStatus, CampaignStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const FIXTURES = {
  password: process.env.TEST_USER_PASSWORD ?? "fixture-password-not-a-secret",
  alpha: {
    orgId: "org_alpha",
    admin: "alpha.admin@example.test",
    member: "alpha.member@example.test",
    suspended: "alpha.suspended@example.test",
    campaignId: "camp_alpha_1",
  },
  beta: {
    orgId: "org_beta",
    admin: "beta.admin@example.test",
    member: "beta.member@example.test",
    campaignId: "camp_beta_1",
  },
} as const;

async function upsertUser(
  email: string,
  passwordHash: string,
  status: UserStatus = UserStatus.ACTIVE,
) {
  return prisma.user.upsert({
    where: { email },
    update: { status },
    create: { email, passwordHash, status, emailVerified: new Date(), name: email.split("@")[0] },
  });
}

async function main() {
  const passwordHash = await bcrypt.hash(FIXTURES.password, 10);

  const alpha = await prisma.organization.upsert({
    where: { id: FIXTURES.alpha.orgId },
    update: {},
    create: { id: FIXTURES.alpha.orgId, name: "Organization Alpha", slug: "alpha" },
  });

  const beta = await prisma.organization.upsert({
    where: { id: FIXTURES.beta.orgId },
    update: {},
    create: { id: FIXTURES.beta.orgId, name: "Organization Beta", slug: "beta" },
  });

  const alphaAdmin = await upsertUser(FIXTURES.alpha.admin, passwordHash);
  const alphaMember = await upsertUser(FIXTURES.alpha.member, passwordHash);
  const alphaSuspended = await upsertUser(
    FIXTURES.alpha.suspended,
    passwordHash,
    UserStatus.SUSPENDED,
  );
  const betaAdmin = await upsertUser(FIXTURES.beta.admin, passwordHash);
  const betaMember = await upsertUser(FIXTURES.beta.member, passwordHash);

  const memberships: Array<[string, string, Role]> = [
    [alphaAdmin.id, alpha.id, Role.OWNER],
    [alphaMember.id, alpha.id, Role.MEMBER],
    [alphaSuspended.id, alpha.id, Role.MEMBER],
    [betaAdmin.id, beta.id, Role.OWNER],
    [betaMember.id, beta.id, Role.MEMBER],
  ];

  for (const [userId, organizationId, role] of memberships) {
    await prisma.membership.upsert({
      where: { userId_organizationId: { userId, organizationId } },
      update: { role },
      create: { userId, organizationId, role },
    });
  }

  // One record per organization. The cross tenant tests use the other organization's ID.
  await prisma.campaign.upsert({
    where: { id: FIXTURES.alpha.campaignId },
    update: {},
    create: {
      id: FIXTURES.alpha.campaignId,
      organizationId: alpha.id,
      title: "Alpha private campaign",
      status: CampaignStatus.PUBLISHED,
      createdById: alphaAdmin.id,
    },
  });

  await prisma.campaign.upsert({
    where: { id: FIXTURES.beta.campaignId },
    update: {},
    create: {
      id: FIXTURES.beta.campaignId,
      organizationId: beta.id,
      title: "Beta private campaign",
      status: CampaignStatus.PUBLISHED,
      createdById: betaAdmin.id,
    },
  });

  console.log("Seeded Organization Alpha and Organization Beta with users, roles, and records.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

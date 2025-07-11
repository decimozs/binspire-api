import db from "../lib/db";
import argon2 from "argon2";
import {
  accountsTable,
  activityTable,
  collectionsTable,
  historyTable,
  issuesTable,
  orgsTable,
  requestsAccessTable,
  tasksTable,
  trashbinsTable,
  usersTable,
} from "../db";
import type { InsertRequestAccess } from "../db";
import { faker } from "@faker-js/faker";
import { roleValues } from "./constant";
import { nanoid } from "nanoid";

const testOrg = await db.query.orgsTable.findFirst({
  where: (table, { eq }) => eq(table.name, "test-org"),
});

if (!testOrg) throw new Error("Failed to seed. Test org not found");

const ORG_ID = testOrg.id;

async function seedBasedUser() {
  const [org] = await db
    .insert(orgsTable)
    .values({
      name: "test-org",
      slug: "test_org",
    })
    .returning();

  if (!org) throw new Error("Failed to seed org table");

  const [user] = await db
    .insert(usersTable)
    .values({
      orgId: org.id,
      name: "Admin",
      email: "admin@gmail.com",
      permission: "superuser",
      role: "admin",
      isOnline: false,
    })
    .returning();

  if (!user) throw new Error("Failed to seed user table");

  const hashedPassword = await argon2.hash("admin12345");

  await db.insert(accountsTable).values({
    userId: user.id,
    password: hashedPassword,
  });

  console.log("✅ Seeded one org, user, and account.");
  console.log("org: ", org);
  console.log("user: ", user);
}

async function seedUsers() {
  const users = Array.from({ length: 100 }, () => {
    return {
      orgId: ORG_ID,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      permission: faker.helpers.arrayElement(["viewer", "editor", "superuser"]),
      role: faker.helpers.arrayElement(roleValues),
      isOnline: faker.datatype.boolean(),
    };
  });

  const hashedPassword = await argon2.hash("admin12345");

  try {
    const insertedUsers = await db.insert(usersTable).values(users).returning();

    const accountsToInsert = insertedUsers.map((user) => ({
      userId: user.id,
      password: hashedPassword,
    }));

    await db.insert(accountsTable).values(accountsToInsert);

    console.log("✅ Seeded 100 users and accounts.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed users: ", error);
    process.exit(1);
  }
}

async function seedRequestAccess() {
  const seedData = Array.from({ length: 100 }, (): InsertRequestAccess => {
    return {
      role: faker.helpers.arrayElement(roleValues),
      name: faker.person.fullName(),
      orgId: ORG_ID,
      reason: faker.lorem.sentence(),
      email: faker.internet.email(),
    };
  });

  try {
    await db.insert(requestsAccessTable).values(seedData);
    console.log("✅ Seeded requests acceess.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed request access data: ", error);
    process.exit(1);
  }
}

async function seedIssues() {
  const users = await db.query.usersTable.findMany();
  const userIds = users.map((user) => user.id);
  const priorities = ["low", "medium", "high"] as const;
  const statuses = ["open", "in-progress", "resolved"] as const;
  const categories = [
    "general",
    "hardware",
    "software",
    "maintenance",
  ] as const;

  const issues = Array.from({ length: 100 }).map(() => {
    return {
      orgId: ORG_ID,
      reporterId: userIds[Math.floor(Math.random() * userIds.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      title: `Issue: ${Math.random().toString(36).substring(2, 8)}`,
      description: "Auto-generated issue for testing.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  await db.insert(issuesTable).values(issues);

  console.log("✅ Seeded 100 issues");
}

async function seedTrashbins() {
  const coordinates: [number, number][] = [
    [14.578656811854344, 121.07458067915695],
    [14.578375640697189, 121.07673515228237],
    [14.577095410235756, 121.07518614779536],
    [14.576657940971273, 121.07622208365427],
    [14.578342384001559, 121.07463193405027],
    [14.579800722724215, 121.07757877798196],
    [14.577886702006609, 121.07578212263957],
    [14.579461020204079, 121.07629044892656],
    [14.579748249763696, 121.07765407870465],
    [14.577254332143326, 121.07655351515689],
  ];

  const trashbins = coordinates.map(([lat, lng], index) => ({
    orgId: ORG_ID,
    name: `Bin-${faker.string.alphanumeric(6).toUpperCase()}`,
    location: faker.location.streetAddress(),
    latitude: lat.toFixed(6),
    longitude: lng.toFixed(6),
    isOperational: faker.datatype.boolean(),
  }));

  await db.insert(trashbinsTable).values(trashbins);

  console.log("✅ Seeded 10 trashbins with fixed lat/lng");
}

async function seedCollections() {
  const trashbins = await db.query.trashbinsTable.findMany();

  const trashbinIds = trashbins.map((bin) => bin.id);

  const collections = Array.from({ length: 300 }).map(() => {
    const wasteLevel = faker.number.int({ min: 0, max: 100 });
    const batteryLevel = faker.number.int({ min: 0, max: 100 });

    return {
      id: nanoid(),
      trashbinId: faker.helpers.arrayElement(trashbinIds),
      weightLevel: faker.number.float({ min: 0.1, max: 20 }).toFixed(2),
      wasteLevel,
      batteryLevel,
      isFull: wasteLevel >= 90,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
    };
  });

  await db.insert(collectionsTable).values(collections);

  console.log("✅ Seeded 300 collections");
}

async function seedActivity() {
  const users = await db.select().from(usersTable);
  if (users.length === 0) throw new Error("No users found");

  const entities = [
    "trashbin",
    "collection",
    "issue",
    "user",
    "history",
    "activity",
    "request-access",
  ];
  const actions = [
    "create",
    "update",
    "delete",
    "approve",
    "reject",
    "archive",
    "restore",
  ];

  const activitySeeds = Array.from({ length: 100 }).map(() => {
    const user = faker.helpers.arrayElement(users);
    const entity = faker.helpers.arrayElement(entities);
    const action = faker.helpers.arrayElement(actions);
    const fakeChanges =
      action === "update"
        ? {
            id: nanoid(),
            before: { status: "pending" },
            after: { status: "approved" },
          }
        : null;

    return {
      orgId: user.orgId,
      actorId: user.id,
      referenceId: nanoid(),
      entity,
      action,
      description: `${action}d a ${entity}`,
      isArchive: faker.datatype.boolean(),
      changes: fakeChanges,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };
  });

  await db.insert(activityTable).values(activitySeeds);

  console.log("✅ Seeded 100 Activity logs using real user IDs");
}

async function seedHistory() {
  const users = await db.select().from(usersTable);
  if (users.length === 0) throw new Error("No users found");

  const sessionActions = [
    "login",
    "logout",
    "password-change",
    "email-verification",
  ];
  const entities = ["auth", "user", "collector", "verification"];

  const historySeeds = Array.from({ length: 100 }).map(() => {
    const user = faker.helpers.arrayElement(users);
    const entity = faker.helpers.arrayElement(entities);
    const action = faker.helpers.arrayElement(sessionActions);

    return {
      orgId: user.orgId,
      actorId: user.id,
      referenceId: nanoid(),
      entity,
      action,
      description: `User ${action} on ${entity}`,
      isArchive: false,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };
  });

  await db.insert(historyTable).values(historySeeds);

  console.log("✅ Seeded 100 History logs using real user IDs");
}

async function seedTask() {
  const users = await db.query.usersTable.findMany();
  const trashbins = await db.query.trashbinsTable.findMany();
  const issues = await db.query.issuesTable.findMany();

  const userIds = users.map((user) => user.id);
  const trashbinIds = trashbins.map((bin) => bin.id);
  const issueIds = issues.map((issue) => issue.id);
  const referenceIds = [...trashbinIds, ...issueIds];

  const tasks = Array.from({ length: 50 }).map(() => {
    return {
      orgId: ORG_ID,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(["pending", "in-progress", "done"]),
      assignedTo: faker.helpers.arrayElement(userIds),
      priority: faker.helpers.arrayElement(["low", "medium", "high"]),
      referenceId: faker.helpers.arrayElement(referenceIds),
      scheduledAt: faker.date.future(),
      dueAt: faker.date.future(),
    };
  });

  await db.insert(tasksTable).values(tasks);

  console.log("✅ Seeded 50 tasks");
}

// await seedBasedUser();
// await seedUsers();
// await seedTrashbins();
// await seedIssues();
// await seedCollections();
// await seedHistory();
// await seedActivity();
// await seedBasedUser();
await seedTask();

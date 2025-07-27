import db from "../lib/db";
import argon2 from "argon2";
import {
  accountsTable,
  activityTable,
  collectionsTable,
  historyTable,
  issuesTable,
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

const globalSeedSize = 300;

async function seedBasedUser() {
  const [adminUser] = await db
    .insert(usersTable)
    .values({
      orgId: ORG_ID,
      name: "Admin",
      email: "admin@gmail.com",
      permission: "superuser",
      role: "admin",
      isOnline: false,
    })
    .returning();

  const [collectorUser] = await db
    .insert(usersTable)
    .values({
      orgId: ORG_ID,
      name: "Collector",
      email: "collector@gmail.com",
      permission: "viewer",
      role: "collector",
      isOnline: false,
    })
    .returning();

  if (!adminUser || !collectorUser)
    throw new Error("Failed to seed user table");

  const adminPassword = await argon2.hash("admin12345");
  const collectorPassword = await argon2.hash("collector12345");

  const hashedAdminPassword = await db.insert(accountsTable).values({
    userId: adminUser.id,
    password: adminPassword,
  });

  const hashedCollectorPassword = await db.insert(accountsTable).values({
    userId: collectorUser.id,
    password: collectorPassword,
  });

  if (!hashedAdminPassword || !hashedCollectorPassword)
    throw new Error("Failed to seed accounts table");

  console.log("admin user: ", adminUser);
  console.log("collector user: ", collectorUser);
}

async function seedUsers() {
  const userSeedSize = 50;
  const users = Array.from({ length: userSeedSize }, () => {
    return {
      orgId: ORG_ID,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      permission: faker.helpers.arrayElement(["viewer", "editor", "superuser"]),
      role: faker.helpers.arrayElement(roleValues),
      isOnline: faker.datatype.boolean(),
    };
  });

  const hashedPassword = await argon2.hash("user12345");

  try {
    const insertedUsers = await db.insert(usersTable).values(users).returning();

    const accountsToInsert = insertedUsers.map((user) => ({
      userId: user.id,
      password: hashedPassword,
    }));

    await db.insert(accountsTable).values(accountsToInsert);

    console.log(`Seeded ${userSeedSize} users.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed users: ", error);
    process.exit(1);
  }
}

async function seedRequestAccess() {
  const seedData = Array.from(
    { length: globalSeedSize },
    (): InsertRequestAccess => {
      return {
        role: faker.helpers.arrayElement(roleValues),
        name: faker.person.fullName(),
        orgId: ORG_ID,
        reason: faker.lorem.sentence(),
        email: faker.internet.email(),
      };
    },
  );

  try {
    await db.insert(requestsAccessTable).values(seedData);
    console.log(`Seeded ${globalSeedSize} request access records`);
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
    "trashbin",
    "analytics",
  ] as const;

  const now = new Date();

  const issues = Array.from({ length: globalSeedSize }).map(() => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const createdAt = new Date(
      now.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    );

    const updatedAt =
      status === "resolved"
        ? new Date(
            createdAt.getTime() +
              Math.floor(Math.random() * 72 + 1) * 60 * 60 * 1000,
          )
        : createdAt;

    return {
      orgId: ORG_ID,
      reporterId: userIds[Math.floor(Math.random() * userIds.length)] as string,
      assignedTo:
        Math.random() < 0.2
          ? null
          : userIds[Math.floor(Math.random() * userIds.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      category: categories[
        Math.floor(Math.random() * categories.length)
      ] as string,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      createdAt,
      updatedAt,
    };
  });

  await db.insert(issuesTable).values(issues);

  console.log(`Seeded ${globalSeedSize} issues with random data`);
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

  console.log("Seeded 10 trashbins with fixed lat/lng");
}

async function seedCollections() {
  const users = await db.query.usersTable.findMany({
    where: (table, { eq }) => eq(table.role, "collector"),
  });
  const trashbins = await db.query.trashbinsTable.findMany();

  const userIds = users.map((user) => user.id);
  const trashbinIds = trashbins.map((bin) => bin.id);

  const collections = Array.from({ length: globalSeedSize }).map(() => {
    const wasteLevel = faker.number.int({ min: 0, max: 100 });
    const batteryLevel = faker.number.int({ min: 0, max: 100 });

    return {
      orgId: ORG_ID,
      id: nanoid(),
      trashbinId: faker.helpers.arrayElement(trashbinIds),
      collectedBy: faker.helpers.arrayElement(userIds),
      weightLevel: faker.number.float({ min: 0.1, max: 20 }).toFixed(2),
      wasteLevel,
      batteryLevel,
      isFull: wasteLevel >= 90,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
    };
  });

  await db.insert(collectionsTable).values(collections);

  console.log(`Seeded ${globalSeedSize} collections with random data`);
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
    "analytics",
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

  const pastTense = (action: string) => {
    const irregular: Record<string, string> = {
      reject: "rejected",
      approve: "approved",
      create: "created",
      delete: "deleted",
      update: "updated",
    };
    return irregular[action] || `${action}d`;
  };

  const activitySeeds = Array.from({ length: globalSeedSize }).map(() => {
    const user = faker.helpers.arrayElement(users);
    const entity = faker.helpers.arrayElement(entities);
    const action = faker.helpers.arrayElement(actions);

    const actionPast = pastTense(action);
    const description = `${actionPast.charAt(0).toUpperCase() + actionPast.slice(1)} a ${entity}`;

    const changes =
      action === "update"
        ? {
            id: nanoid(),
            before: { status: "pending" },
            after: { status: "approved" },
          }
        : null;

    const timestamp = faker.date.recent();

    return {
      orgId: user.orgId,
      actorId: user.id,
      referenceId: nanoid(),
      entity,
      action,
      description,
      isArchive: faker.datatype.boolean(),
      changes,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });

  await db.insert(activityTable).values(activitySeeds);

  console.log(`Seeded ${globalSeedSize} activity logs using real user IDs`);
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

  const historySeeds = Array.from({ length: globalSeedSize }).map(() => {
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

  console.log(`Seeded ${globalSeedSize} history logs using real user IDs`);
}

async function seedTask() {
  const users = await db.query.usersTable.findMany();
  const trashbins = await db.query.trashbinsTable.findMany();
  const issues = await db.query.issuesTable.findMany();

  const userIds = users.map((user) => user.id);
  const trashbinIds = trashbins.map((bin) => bin.id);
  const issueIds = issues.map((issue) => issue.id);
  const referenceIds = [...trashbinIds, ...issueIds];

  const tasks = Array.from({ length: 100 }).map(() => {
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

  console.log("Seeded 100 tasks");
}

async function resetTables() {
  await db.delete(activityTable);
  await db.delete(collectionsTable);
  await db.delete(historyTable);
  await db.delete(issuesTable);
  await db.delete(requestsAccessTable);
  await db.delete(tasksTable);
  console.log(
    "Reset all tables except usersTable, accountsTable and trashbinsTable",
  );
}

// await seedBasedUser();
// await seedUsers();
// await seedTrashbins();
// await seedIssues();
await seedCollections();
// await seedHistory();
// await seedActivity();
// await seedBasedUser();
// await seedTask();
// await seedRequestAccess();
// await resetTables();

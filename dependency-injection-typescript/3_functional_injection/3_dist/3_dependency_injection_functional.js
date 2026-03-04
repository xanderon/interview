// Varianta JavaScript rulabila direct.

async function getUserProfile(userId, deps) {
  const { db, logger, context } = deps;

  logger.info(`[${context.requestId}] Caut user ${userId}`);

  const user = await db.gasesteUserDupaId(userId);

  if (!user) {
    logger.error(`[${context.requestId}] User ${userId} nu exista`);
    throw new Error("User not found");
  }

  logger.info(`[${context.requestId}] User ${userId} gasit: ${user.email}`);
  return user;
}

class InMemoryDb {
  constructor() {
    this.users = new Map([
      ["u1", { id: "u1", email: "ana@example.com" }],
      ["u2", { id: "u2", email: "mihai@example.com" }],
    ]);
  }

  async gasesteUserDupaId(id) {
    return this.users.get(id) ?? null;
  }
}

class ConsoleLogger {
  info(mesaj) {
    console.log(`[INFO] ${mesaj}`);
  }

  error(mesaj) {
    console.log(`[ERROR] ${mesaj}`);
  }
}

class FakeDb {
  constructor(raspuns) {
    this.raspuns = raspuns;
  }

  async gasesteUserDupaId(_id) {
    return this.raspuns;
  }
}

class FakeLogger {
  constructor() {
    this.logs = [];
  }

  info(mesaj) {
    this.logs.push(`[INFO] ${mesaj}`);
  }

  error(mesaj) {
    this.logs.push(`[ERROR] ${mesaj}`);
  }
}

(async () => {
  console.log("Porneste exemplul 3_functional_injection...");

  const depsProd = {
    db: new InMemoryDb(),
    logger: new ConsoleLogger(),
    context: { requestId: "req-prod-1" },
  };

  const user = await getUserProfile("u1", depsProd);
  console.log("User profil (prod):", user);

  console.log("---");

  const fakeLogger = new FakeLogger();
  const depsTest = {
    db: new FakeDb({ id: "u-test", email: "test@example.com" }),
    logger: fakeLogger,
    context: { requestId: "req-test-1" },
  };

  const userTest = await getUserProfile("orice-id", depsTest);
  console.log("User profil (test):", userTest);
  console.log("Logs fake:", fakeLogger.logs);
})();

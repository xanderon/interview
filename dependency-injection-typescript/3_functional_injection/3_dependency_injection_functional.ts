// DI functional style (foarte comun in Node.js):
// functia primeste dependintele din exterior: { db, logger, context }.
// Nu conteaza implementarea concreta din spate, cat timp respecta contractul.

type User = {
  id: string;
  email: string;
};

interface Db {
  gasesteUserDupaId(id: string): Promise<User | null>;
}

interface Logger {
  info(mesaj: string): void;
  error(mesaj: string): void;
}

type RequestContext = {
  requestId: string;
};

type Dependencies = {
  db: Db;
  logger: Logger;
  context: RequestContext;
};

// Functia de business depinde de abstractii/contracte, nu de implementari concrete.
async function getUserProfile(userId: string, deps: Dependencies): Promise<User> {
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

// Implementare concreta #1 (simulam o baza reala)
class InMemoryDb implements Db {
  private users = new Map<string, User>([
    ["u1", { id: "u1", email: "ana@example.com" }],
    ["u2", { id: "u2", email: "mihai@example.com" }],
  ]);

  async gasesteUserDupaId(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }
}

class ConsoleLogger implements Logger {
  info(mesaj: string): void {
    console.log(`[INFO] ${mesaj}`);
  }

  error(mesaj: string): void {
    console.log(`[ERROR] ${mesaj}`);
  }
}

// Implementare fake pentru teste
class FakeDb implements Db {
  constructor(private raspuns: User | null) {}

  async gasesteUserDupaId(_id: string): Promise<User | null> {
    return this.raspuns;
  }
}

class FakeLogger implements Logger {
  public logs: string[] = [];

  info(mesaj: string): void {
    this.logs.push(`[INFO] ${mesaj}`);
  }

  error(mesaj: string): void {
    this.logs.push(`[ERROR] ${mesaj}`);
  }
}

(async () => {
  console.log("Porneste exemplul 3_functional_injection...");

  // Productie: injectam implementari reale.
  const depsProd: Dependencies = {
    db: new InMemoryDb(),
    logger: new ConsoleLogger(),
    context: { requestId: "req-prod-1" },
  };

  const user = await getUserProfile("u1", depsProd);
  console.log("User profil (prod):", user);

  console.log("---");

  // Test: injectam fake-uri.
  const fakeLogger = new FakeLogger();
  const depsTest: Dependencies = {
    db: new FakeDb({ id: "u-test", email: "test@example.com" }),
    logger: fakeLogger,
    context: { requestId: "req-test-1" },
  };

  const userTest = await getUserProfile("orice-id", depsTest);
  console.log("User profil (test):", userTest);
  console.log("Logs fake:", fakeLogger.logs);
})();

// Singleton: asigura o singura instanta globala pentru o clasa.
// Util cand ai nevoie de un punct unic de acces (ex: config, registry).

class AppConfig {
  // Referinta statica la instanta unica.
  private static instance: AppConfig | null = null;

  private values: Record<string, string>;

  // Constructorul este private => nu poti face new AppConfig() din exterior.
  private constructor() {
    this.values = {
      env: "dev",
      region: "eu-central",
    };
  }

  // Metoda statica care returneaza mereu aceeasi instanta.
  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  get(key: string): string | undefined {
    return this.values[key];
  }

  set(key: string, value: string): void {
    this.values[key] = value;
  }
}

console.log("Porneste exemplul 1_singleton...");

const configA = AppConfig.getInstance();
const configB = AppConfig.getInstance();

console.log("Aceeasi instanta?", configA === configB);

configA.set("env", "prod");
console.log("configB env:", configB.get("env"));

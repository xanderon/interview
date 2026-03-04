// Varianta JavaScript rulabila direct.

class AppConfig {
  static instance = null;

  constructor() {
    this.values = {
      env: "dev",
      region: "eu-central",
    };
  }

  static getInstance() {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  get(key) {
    return this.values[key];
  }

  set(key, value) {
    this.values[key] = value;
  }
}

console.log("Porneste exemplul 1_singleton...");

const configA = AppConfig.getInstance();
const configB = AppConfig.getInstance();

console.log("Aceeasi instanta?", configA === configB);

configA.set("env", "prod");
console.log("configB env:", configB.get("env"));

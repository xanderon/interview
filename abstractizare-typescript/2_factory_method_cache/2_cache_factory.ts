// Abstraction + Factory Method pentru un cache.
// Consumatorul lucreaza doar cu contractul (CacheService),
// fara sa stie daca in spate este Redis sau Memcached.

// 1) Contractul abstract expune operatiile disponibile pentru cache.
abstract class CacheService {
  abstract get(key: string): string | null;
  abstract set(key: string, value: string): void;

  // Metoda comuna (optional) pentru toate implementararile.
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// 2) Implementare concreta "Redis" (simulata cu Map).
class RedisCacheService extends CacheService {
  private storage = new Map<string, string>();

  override get(key: string): string | null {
    console.log(`[Redis] GET ${key}`);
    return this.storage.get(key) ?? null;
  }

  override set(key: string, value: string): void {
    console.log(`[Redis] SET ${key}=${value}`);
    this.storage.set(key, value);
  }
}

// 3) Implementare concreta "Memcached" (simulata cu Map).
class MemcachedCacheService extends CacheService {
  private storage = new Map<string, string>();

  override get(key: string): string | null {
    console.log(`[Memcached] GET ${key}`);
    return this.storage.get(key) ?? null;
  }

  override set(key: string, value: string): void {
    console.log(`[Memcached] SET ${key}=${value}`);
    this.storage.set(key, value);
  }
}

// 4) Factory Method: decide ce obiect concret returneaza.
abstract class CacheFactory {
  // Factory Method: subclasele aleg implementarea concreta.
  abstract createCacheService(): CacheService;
}

class RedisCacheFactory extends CacheFactory {
  override createCacheService(): CacheService {
    return new RedisCacheService();
  }
}

class MemcachedCacheFactory extends CacheFactory {
  override createCacheService(): CacheService {
    return new MemcachedCacheService();
  }
}

// 5) Consumatorul depinde doar de abstractii (CacheFactory + CacheService).
function ruleazaConsumator(factory: CacheFactory): void {
  // Consumatorul NU stie implementarea concreta.
  const cache = factory.createCacheService();

  cache.set("user:42", "Xan");

  const value = cache.get("user:42");
  console.log(`Valoare citita: ${value}`);

  console.log(`Exista user:42? ${cache.has("user:42")}`);
}

console.log("Porneste exemplul 2_factory_method_cache...");
console.log("--- Varianta Redis ---");
ruleazaConsumator(new RedisCacheFactory());

console.log("\n--- Varianta Memcached ---");
ruleazaConsumator(new MemcachedCacheFactory());

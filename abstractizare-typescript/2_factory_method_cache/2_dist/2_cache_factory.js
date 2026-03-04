// Varianta JavaScript rulabila direct cu Node.

class CacheService {
  get(_key) {
    throw new Error("get() trebuie implementat in clasa concreta.");
  }

  set(_key, _value) {
    throw new Error("set() trebuie implementat in clasa concreta.");
  }

  has(key) {
    return this.get(key) !== null;
  }
}

class RedisCacheService extends CacheService {
  constructor() {
    super();
    this.storage = new Map();
  }

  get(key) {
    console.log(`[Redis] GET ${key}`);
    return this.storage.get(key) ?? null;
  }

  set(key, value) {
    console.log(`[Redis] SET ${key}=${value}`);
    this.storage.set(key, value);
  }
}

class MemcachedCacheService extends CacheService {
  constructor() {
    super();
    this.storage = new Map();
  }

  get(key) {
    console.log(`[Memcached] GET ${key}`);
    return this.storage.get(key) ?? null;
  }

  set(key, value) {
    console.log(`[Memcached] SET ${key}=${value}`);
    this.storage.set(key, value);
  }
}

class CacheFactory {
  createCacheService() {
    throw new Error("createCacheService() trebuie implementata in factory concret.");
  }
}

class RedisCacheFactory extends CacheFactory {
  createCacheService() {
    return new RedisCacheService();
  }
}

class MemcachedCacheFactory extends CacheFactory {
  createCacheService() {
    return new MemcachedCacheService();
  }
}

function ruleazaConsumator(factory) {
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

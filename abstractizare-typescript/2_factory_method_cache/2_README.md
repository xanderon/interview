# 2_factory_method_cache - Abstraction + Factory Method

## Principiul pe scurt

Abstracția înseamnă:
- expui un **contract** (`CacheService`)
- ascunzi detaliile de implementare (`RedisCacheService`, `MemcachedCacheService`)

Factory Method înseamnă:
- nu faci `new RedisCacheService()` direct în consumator
- consumatorul primește un `CacheFactory`
- factory-ul decide ce implementare concretă creează

Astfel, consumatorul știe doar:
- are `get/set/has`
- nu știe dacă backend-ul este Redis sau Memcached

## Cum e structurat exemplul

- `CacheService` (abstract): contractul comun
- `RedisCacheService` / `MemcachedCacheService`: implementări concrete
- `CacheFactory` (abstract): definește Factory Method-ul `createCacheService()`
- `RedisCacheFactory` / `MemcachedCacheFactory`: fabrici concrete
- `ruleazaConsumator(factory)`: consumatorul care lucrează doar cu abstracții

## De ce e util

- poți schimba backend-ul fără să atingi codul consumatorului
- poți testa ușor (injectezi un factory fake)
- respecți principiul "depend on abstractions, not concretions"

## Fișiere

- `2_cache_factory.ts` - varianta TypeScript cu comentarii
- `2_dist/2_cache_factory.js` - varianta JavaScript rulabilă direct

## Rulare rapidă JS (fără instalări)

```bash
cd "/Users/xan/Documents/Github repos/interview/abstractizare-typescript/2_factory_method_cache"
node "./2_dist/2_cache_factory.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/abstractizare-typescript/2_factory_method_cache"
npx -y -p typescript tsc "./2_cache_factory.ts" --target ES2020 --module commonjs --outDir "./2_dist"
node "./2_dist/2_cache_factory.js"
```

## Pitfalls (pe scurt)

- Nu transforma factory-ul intr-un loc cu prea multa logica de business.
- Evita contracte de cache prea dependente de un provider concret.
- Daca ai doar o singura implementare stabila, factory-ul poate fi overengineering.

## Output așteptat (exemplu)

```text
Porneste exemplul 2_factory_method_cache...
--- Varianta Redis ---
[Redis] SET user:42=Xan
[Redis] GET user:42
Valoare citita: Xan
[Redis] GET user:42
Exista user:42? true

--- Varianta Memcached ---
[Memcached] SET user:42=Xan
[Memcached] GET user:42
Valoare citita: Xan
[Memcached] GET user:42
Exista user:42? true
```

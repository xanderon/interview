// Dependency Injection (DI) = clasa nu-si creeaza singura dependintele,
// ci le primeste din exterior (constructor injection).
// Avantaj: cod decuplat si usor de testat.

interface Notifier {
  trimite(mesaj: string): void;
}

class EmailNotifier implements Notifier {
  trimite(mesaj: string): void {
    console.log(`[Email] ${mesaj}`);
  }
}

class SmsNotifier implements Notifier {
  trimite(mesaj: string): void {
    console.log(`[SMS] ${mesaj}`);
  }
}

// Fake pentru teste: nu trimite real, doar colecteaza mesaje.
class FakeNotifier implements Notifier {
  public mesaje: string[] = [];

  trimite(mesaj: string): void {
    this.mesaje.push(mesaj);
    console.log(`[FAKE] mesaj capturat: ${mesaj}`);
  }
}

class ServiciuComenzi {
  // Dependinta este injectata in constructor.
  constructor(private notifier: Notifier) {}

  plaseazaComanda(idComanda: string): void {
    console.log(`Comanda ${idComanda} a fost plasata.`);
    this.notifier.trimite(`Comanda ${idComanda} este confirmata.`);
  }
}

console.log("Porneste exemplul 1_simplu dependency injection...");

// Productie: putem injecta EmailNotifier.
const serviciuEmail = new ServiciuComenzi(new EmailNotifier());
serviciuEmail.plaseazaComanda("CMD-100");

console.log("---");

// Schimbare simpla: injectam SmsNotifier, fara modificari in ServiciuComenzi.
const serviciuSms = new ServiciuComenzi(new SmsNotifier());
serviciuSms.plaseazaComanda("CMD-101");

console.log("---");

// DI NU inseamna neaparat "injectez o clasa".
// Putem injecta direct un obiect care respecta contractul Notifier.
const notifierObiect: Notifier = {
  trimite(mesaj: string): void {
    console.log(`[ObjectNotifier] ${mesaj}`);
  },
};
const serviciuCuObiect = new ServiciuComenzi(notifierObiect);
serviciuCuObiect.plaseazaComanda("CMD-OBJ");

console.log("---");

// Testare: injectam fake.
const fake = new FakeNotifier();
const serviciuTest = new ServiciuComenzi(fake);
serviciuTest.plaseazaComanda("CMD-TEST");
console.log("Mesaje in fake:", fake.mesaje);

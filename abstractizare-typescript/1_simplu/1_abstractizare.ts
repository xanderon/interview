// Abstraction = definim un contract comun (ce trebuie facut),
// iar clasele concrete decid CUM il implementeaza.

abstract class MetodaPlata {
  // Metoda abstracta: fiecare metoda de plata trebuie sa o implementeze.
  abstract plateste(suma: number): void;

  // Metoda concreta comuna pentru toate metodele de plata.
  afiseazaMesajStart(suma: number): void {
    console.log(`Incepe plata de ${suma} RON...`);
  }
}

class PlataCuCard extends MetodaPlata {
  // Implementam contractul abstract.
  override plateste(suma: number): void {
    this.afiseazaMesajStart(suma);
    console.log(`Plata cu cardul a fost procesata: ${suma} RON.`);
  }
}

class PlataCash extends MetodaPlata {
  override plateste(suma: number): void {
    this.afiseazaMesajStart(suma);
    console.log(`Plata cash a fost inregistrata: ${suma} RON.`);
  }
}

console.log("Porneste exemplul 1_simplu abstractizare...");

const card = new PlataCuCard();
card.plateste(150);

console.log("---");

const cash = new PlataCash();
cash.plateste(80);

// Nu putem face: new MetodaPlata()
// pentru ca este clasa abstracta.

// Varianta JavaScript rulabila direct.
// Folosim camp privat real (#sold), suportat in Node modern.

class ContBancar {
  #sold;

  constructor(soldInitial) {
    if (soldInitial < 0) {
      throw new Error("Soldul initial nu poate fi negativ.");
    }
    this.#sold = soldInitial;
  }

  getSold() {
    return this.#sold;
  }

  depune(suma) {
    if (suma <= 0) {
      throw new Error("Suma depusa trebuie sa fie mai mare ca 0.");
    }
    this.#sold += suma;
  }

  retrage(suma) {
    if (suma <= 0) {
      throw new Error("Suma retrasa trebuie sa fie mai mare ca 0.");
    }
    if (suma > this.#sold) {
      throw new Error("Fonduri insuficiente.");
    }
    this.#sold -= suma;
  }
}

console.log("Porneste exemplul 1_simplu encapsulare...");

const cont = new ContBancar(1000);
console.log(`Sold initial: ${cont.getSold()} RON`);

cont.depune(250);
console.log(`Dupa depunere: ${cont.getSold()} RON`);

cont.retrage(400);
console.log(`Dupa retragere: ${cont.getSold()} RON`);

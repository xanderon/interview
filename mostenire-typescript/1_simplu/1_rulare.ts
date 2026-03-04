// Fisier self-contained (fara import/export) ca sa fie simplu de compilat/rulat.

class Animal {
  protected nume: string;

  constructor(nume: string) {
    this.nume = nume;
  }

  mananca(): void {
    console.log(`${this.nume} mananca.`);
  }
}

class Caine extends Animal {
  latra(): void {
    console.log(`${this.nume} latra: Ham! Ham!`);
  }

  override mananca(): void {
    console.log(`${this.nume} mananca boabe pentru caini.`);
  }
}

console.log("Porneste exemplul 1_simplu...");

const animalGeneric = new Animal("Animal generic");
animalGeneric.mananca();

console.log("---");

const rex = new Caine("Rex");
rex.mananca();
rex.latra();

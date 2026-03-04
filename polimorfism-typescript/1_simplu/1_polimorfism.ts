// Polimorfism = acelasi contract, comportament diferit in functie de obiectul concret.
// Aici toate clasele implementeaza metoda "calculeazaArie", dar fiecare diferit.

abstract class FormaGeometrica {
  // Contract comun: orice forma trebuie sa stie sa calculeze aria.
  abstract calculeazaArie(): number;

  // Metoda comuna pentru afisare.
  descriere(): void {
    console.log("Sunt o forma geometrica.");
  }
}

class Cerc extends FormaGeometrica {
  constructor(private raza: number) {
    super();
  }

  override calculeazaArie(): number {
    return Math.PI * this.raza * this.raza;
  }
}

class Dreptunghi extends FormaGeometrica {
  constructor(private latime: number, private inaltime: number) {
    super();
  }

  override calculeazaArie(): number {
    return this.latime * this.inaltime;
  }
}

class Triunghi extends FormaGeometrica {
  constructor(private baza: number, private inaltime: number) {
    super();
  }

  override calculeazaArie(): number {
    return (this.baza * this.inaltime) / 2;
  }
}

// Functia primeste contractul abstract, nu clase concrete.
// Asta permite polimorfism: aceeasi functie merge pentru toate formele.
function afiseazaArie(forma: FormaGeometrica): void {
  forma.descriere();
  console.log(`Arie: ${forma.calculeazaArie().toFixed(2)}`);
}

console.log("Porneste exemplul 1_simplu polimorfism...");

const forme: FormaGeometrica[] = [new Cerc(3), new Dreptunghi(4, 6), new Triunghi(10, 5)];

for (const forma of forme) {
  afiseazaArie(forma);
  console.log("---");
}

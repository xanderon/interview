// Varianta JavaScript rulabila direct.

class FormaGeometrica {
  calculeazaArie() {
    throw new Error("calculeazaArie() trebuie implementata in clasa copil.");
  }

  descriere() {
    console.log("Sunt o forma geometrica.");
  }
}

class Cerc extends FormaGeometrica {
  constructor(raza) {
    super();
    this.raza = raza;
  }

  calculeazaArie() {
    return Math.PI * this.raza * this.raza;
  }
}

class Dreptunghi extends FormaGeometrica {
  constructor(latime, inaltime) {
    super();
    this.latime = latime;
    this.inaltime = inaltime;
  }

  calculeazaArie() {
    return this.latime * this.inaltime;
  }
}

class Triunghi extends FormaGeometrica {
  constructor(baza, inaltime) {
    super();
    this.baza = baza;
    this.inaltime = inaltime;
  }

  calculeazaArie() {
    return (this.baza * this.inaltime) / 2;
  }
}

function afiseazaArie(forma) {
  forma.descriere();
  console.log(`Arie: ${forma.calculeazaArie().toFixed(2)}`);
}

console.log("Porneste exemplul 1_simplu polimorfism...");

const forme = [new Cerc(3), new Dreptunghi(4, 6), new Triunghi(10, 5)];

for (const forma of forme) {
  afiseazaArie(forma);
  console.log("---");
}

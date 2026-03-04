"use strict";
// Fisier self-contained (fara import/export) ca sa fie simplu de compilat/rulat.
class Animal {
    constructor(nume) {
        this.nume = nume;
    }
    mananca() {
        console.log(`${this.nume} mananca.`);
    }
}
class Caine extends Animal {
    latra() {
        console.log(`${this.nume} latra: Ham! Ham!`);
    }
    mananca() {
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

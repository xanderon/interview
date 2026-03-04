// Immutability = obiectul nu se modifica dupa creare.
// In loc sa schimbam obiectul original, cream unul nou.
function creeazaProdus(id, nume, pret) {
    // Object.freeze blocheaza modificarile la runtime (shallow).
    return Object.freeze({ id, nume, pret });
}
function aplicaDiscount(produs, procent) {
    if (procent < 0 || procent > 100) {
        throw new Error("Discount invalid. Trebuie intre 0 si 100.");
    }
    // Nu modificam produs.pret.
    // Returnam un obiect nou cu pretul recalculat.
    const pretNou = Number((produs.pret * (1 - procent / 100)).toFixed(2));
    return Object.freeze({ ...produs, pret: pretNou });
}
console.log("Porneste exemplul 1_simplu immutability...");
const produsInitial = creeazaProdus("p1", "Laptop", 5000);
const produsCuDiscount = aplicaDiscount(produsInitial, 10);
console.log("Produs initial:", produsInitial);
console.log("Produs nou (discount):", produsCuDiscount);
console.log("Sunt acelasi obiect?", produsInitial === produsCuDiscount);
// In TypeScript, asta da eroare de compilare (Readonly):
// produsInitial.pret = 1;

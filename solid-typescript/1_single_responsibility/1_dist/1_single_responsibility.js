// Varianta JavaScript rulabila direct.

class OrderRepository {
  constructor() {
    this.storage = new Map();
  }

  save(comanda) {
    this.storage.set(comanda.id, comanda);
  }

  getById(id) {
    return this.storage.get(id) ?? null;
  }
}

class EmailService {
  trimiteConfirmare(comanda) {
    console.log(`[Email] Comanda ${comanda.id} confirmata. Total: ${comanda.total} RON`);
  }
}

class OrderService {
  constructor(repo, email) {
    this.repo = repo;
    this.email = email;
  }

  confirmaComanda(id) {
    const comanda = this.repo.getById(id);

    if (!comanda) {
      throw new Error(`Comanda ${id} nu exista.`);
    }

    if (comanda.status === "confirmata") {
      console.log(`Comanda ${id} era deja confirmata.`);
      return;
    }

    const actualizata = { ...comanda, status: "confirmata" };
    this.repo.save(actualizata);
    this.email.trimiteConfirmare(actualizata);
  }
}

console.log("Porneste exemplul 1_single_responsibility...");

const repo = new OrderRepository();
const email = new EmailService();
const service = new OrderService(repo, email);

repo.save({ id: "ORD-1", total: 250, status: "noua" });
service.confirmaComanda("ORD-1");

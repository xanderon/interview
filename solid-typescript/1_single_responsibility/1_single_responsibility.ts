// Single Responsibility Principle (SRP):
// o clasa/functie ar trebui sa aiba un singur motiv de schimbare.

// 1) Responsabilitate: model de date pentru comanda.
type Comanda = {
  id: string;
  total: number;
  status: "noua" | "confirmata";
};

// 2) Responsabilitate: persistenta datelor.
class OrderRepository {
  private storage = new Map<string, Comanda>();

  save(comanda: Comanda): void {
    this.storage.set(comanda.id, comanda);
  }

  getById(id: string): Comanda | null {
    return this.storage.get(id) ?? null;
  }
}

// 3) Responsabilitate: trimitere notificari.
class EmailService {
  trimiteConfirmare(comanda: Comanda): void {
    console.log(`[Email] Comanda ${comanda.id} confirmata. Total: ${comanda.total} RON`);
  }
}

// 4) Responsabilitate: logica de business pentru comenzi.
class OrderService {
  constructor(
    private repo: OrderRepository,
    private email: EmailService
  ) {}

  confirmaComanda(id: string): void {
    const comanda = this.repo.getById(id);

    if (!comanda) {
      throw new Error(`Comanda ${id} nu exista.`);
    }

    if (comanda.status === "confirmata") {
      console.log(`Comanda ${id} era deja confirmata.`);
      return;
    }

    // Schimbam doar starea de business.
    const actualizata: Comanda = { ...comanda, status: "confirmata" };
    this.repo.save(actualizata);

    // Notificarea ramane delegata la componenta dedicata.
    this.email.trimiteConfirmare(actualizata);
  }
}

console.log("Porneste exemplul 1_single_responsibility...");

const repo = new OrderRepository();
const email = new EmailService();
const service = new OrderService(repo, email);

repo.save({ id: "ORD-1", total: 250, status: "noua" });
service.confirmaComanda("ORD-1");

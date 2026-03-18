# Algorithm Planner (Trainer Mode)

Dashboard local pentru pregatire algoritmi, cu focus pe roadmap-ul de interviu:
- checklist clar pe categorii (Array, Binary Search, Stack, Linked List, Tree, Queue, Recursion, Matrix)
- bifare progres per problema (`todo / in_progress / done`)
- metadata editabila per problema (`difficulty`, `docsUrl`, `solutionPath`, `notes`)
- AI coach pe problema selectata (nu pe concept teoretic)
- reminders pentru review-uri due si pauze prea lungi

## 1) API key (optional)

Creeaza fisierul:

`/Users/xan/Documents/Github repos/interview/trainer-mode/.env`

cu:

```bash
OPENAI_API_KEY=sk-...
```

Fara key, aplicatia foloseste fallback local pentru feedback.

## 2) Start

```bash
cd "/Users/xan/Documents/Github repos/interview/trainer-mode"
npm start
```

Apoi deschide [http://localhost:8787](http://localhost:8787).

## 3) Cum il folosesti

1. Lucrezi din "Checklist pe categorii" si bifezi pe masura ce avansezi.
2. Completezi pentru fiecare problema difficulty/docs/solution/notes.
3. Trimiti check-in pe problema curenta.
4. Primesti gaps + next actions.

## 4) Persistenta

`data/state.json` salveaza profilul, schedule-ul, roadmap-ul, progresul pe probleme si check-in-urile.

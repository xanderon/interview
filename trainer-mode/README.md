# Trainer Mode

Trainer Mode este un dashboard local pentru pregatirea interviului:
- plan zilnic vizual (`Todo / In Progress / Done`)
- check-in de active recall + feedback AI
- reminders cand nu ai studiat in fereastra de invatare
- urmarire pe concepte cu accent pe deal-breakers

## 1) Unde pui API key-ul

Creeaza fisierul:

`/Users/xan/Documents/Github repos/interview/trainer-mode/.env`

cu exact:

```bash
OPENAI_API_KEY=sk-...
```

Daca lipseste key-ul, aplicatia foloseste fallback local pentru feedback.

## 2) Start

Din repo root:

```bash
cd "/Users/xan/Documents/Github repos/interview/trainer-mode"
npm start
```

Apoi deschide:

[http://localhost:8787](http://localhost:8787)

## 3) Cum il folosesti

1. Tragi task-urile intre coloane pe masura ce lucrezi.
2. Completezi `Concept + Confidence + Recall + Summary`.
3. Apesi `Send to AI Coach`.
4. Primesti verdict + gaps + next actions + sugestii de repetitie.

## 4) Program presetat (editabil in `data/state.json`)

- Luni: liber (09:00-21:30)
- Marti-Joi: dupa birou (16:00-22:00)
- Vineri: mai putin (18:00-21:00)

## 5) Ce tine minte

- progres pe concept (`mastery`, `lastReviewed`, `nextReview`)
- task-uri si status
- check-in-uri
- `lastStudyAt` pentru reminders

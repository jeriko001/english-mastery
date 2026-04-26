# 🇺🇸 English Mastery PWA

Learn American English from A1 to C1 — no lives, no streaks, just learning.

## Features

- **Adaptive Placement Test** — finds your CEFR level (A1→C1) in real time
- **Spaced Repetition** (SM-2) — wrong answers come back at smart intervals
- **4 exercise types** — fill in the blank, multiple choice, vocabulary, reading comprehension
- **Audio** — Web Speech API with American English voice
- **Grammar reference** — rules and explanations for every level
- **Dark mode, mobile-first**
- **Offline ready** — full PWA with service worker
- **Export / Import** — save and restore your progress as JSON

---

## 🚀 Deploy to GitHub Pages

### 1. Create the repo

Create a new GitHub repository named **`english-mastery`** (or any name you like).

### 2. Update the base path

Open `vite.config.js` and change the `base` to match your repo name:

```js
base: '/YOUR-REPO-NAME/',
```

Also update `index.html` — replace all `/english-mastery/` with `/YOUR-REPO-NAME/`.

### 3. Push the code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### 4. Enable GitHub Pages

Go to your repo → **Settings** → **Pages** → Source: **GitHub Actions**

That's it. Every push to `main` auto-deploys. ✅

---

## 🛠 Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/english-mastery/](http://localhost:5173/english-mastery/)

---

## 📁 Project structure

```
english-mastery/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← all app logic + content
│   └── main.jsx       ← React entry point
├── .github/
│   └── workflows/
│       └── deploy.yml ← auto GitHub Pages deploy
├── index.html
├── vite.config.js
└── package.json
```

---

## ➕ Adding your own exercises

All content lives in `src/App.jsx` at the top, in the `EXERCISES_DB` object.

Each exercise follows this structure:

```js
{
  id: "unique_id",       // must be unique
  type: "fill_blank",    // fill_blank | multiple_choice | vocabulary | reading
  level: "B1",           // A1 | A2 | B1 | B2 | C1
  question: "She ___ never ___ Thai food.", // use ___ for blanks
  options: ["have / tried", "had / tried", "have / try", "did / try", "was / trying"],
  answer: "have / tried", // for multi-blank: "word1 / word2"
  explanation: "Present perfect: have/has + past participle",
  // For reading type only:
  passage: "The text the student reads before answering...",
}
```

For grammar rules, edit the `GRAMMAR_RULES` object in the same file.

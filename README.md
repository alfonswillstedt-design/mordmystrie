# Mordmyst — print system

Turns the mystery's five markdown files into print-ready PDFs.

## Build everything

One command, run once from this folder:

```
npm install && npm run build
```

The finished PDFs appear in **`out/thornmere-hall/`**, sorted into four folders:

```
out/thornmere-hall/
  letter/full-colour/     ← US Letter, full colour
  letter/ink-saver/       ← US Letter, ink-saver
  a4/full-colour/         ← A4, full colour
  a4/ink-saver/           ← A4, ink-saver
  SOLUTION — do not open until the end/
```

Each of the four folders holds the complete printable set: host guide, character
booklets, evidence cards, private notes, envelope texts, envelope labels, place
cards, verdict cards, and the invitation. Print the folder that matches your
paper and your ink budget.

The **solution** is kept in its own folder, on its own, so you never open it by
accident. Its first page is a warning, so you can print it without reading it.

## Change the theme or the number of players

Open **`content/thornmere-hall/mystery.toml`** and change one line.

```
theme   = "gothic-dusk"     # gothic-dusk · aged-parchment · modern-elegant · autumn-dark · case-file
players = 8                 # 8 = full cast, 6 = core cast
```

Save, run the build command again. Nothing else to touch.

---

*Needs [Node.js](https://nodejs.org) and Google Chrome (or Chromium) installed on the machine. Everything else the build installs itself.*

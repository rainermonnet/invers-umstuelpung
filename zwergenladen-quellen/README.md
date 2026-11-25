# Zwergenwald – Quellen

Quellen für das Umbaukonzept des Zwergenladens.

- `zwergenladen-umbau.html` – Konzeptseite mit allen Zeichnungen (Grundriss, Wandabwicklungen, Insel)
- `paper-template.html` – A4-Vorlage für das Paper
- `build_paper.py` – setzt Zeichnungen und Vorlage zu `zwergenwald-paper.html` zusammen
- `pdf.js` – erzeugt daraus mit Playwright das PDF

```sh
cd zwergenladen-quellen
python3 build_paper.py
node pdf.js "$PWD/zwergenwald-paper.html" "$PWD/../Zwergenwald-Konzept.pdf"
```

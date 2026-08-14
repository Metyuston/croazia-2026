import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const sourceUrl = process.argv[2] || "http://localhost:3000";
const projectUrl = "https://metyuston.github.io/croazia-2026/";
const response = await fetch(sourceUrl);

if (!response.ok) {
  throw new Error(`Impossibile esportare il sito: ${response.status}`);
}

const rendered = await response.text();
const main = rendered.match(/<main[\s\S]*?<\/main>/)?.[0];

if (!main) {
  throw new Error("Contenuto principale non trovato nella pagina renderizzata.");
}

const cssSource = await readFile("../site/app/globals.css", "utf8");
const css = cssSource
  .replace('@import "tailwindcss";', "")
  .replace(":root{", ':root{--font-sans:Arial,Helvetica,sans-serif;--font-display:Georgia,"Times New Roman",serif;');
const html = `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#073f43">
  <title>Croazia 2026 · La nostra guida</title>
  <meta name="description" content="Il viaggio di Mattia, Francesca, Gabriele e Cristina tra Rovigno, Krk e Cres, dal 5 al 13 settembre 2026.">
  <meta property="og:title" content="Croazia 2026 · La nostra guida">
  <meta property="og:description" content="Nove giorni tra Rovigno, Krk e Cres.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${projectUrl}">
  <meta property="og:image" content="${projectUrl}og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="favicon.svg">
  <style>${css}</style>
</head>
<body>${main}</body>
</html>`;

await mkdir(".", { recursive: true });
await writeFile("index.html", html, "utf8");
await copyFile("../site/public/og.png", "og.png");
await copyFile("../site/public/favicon.svg", "favicon.svg");
console.log("GitHub Pages export ready");

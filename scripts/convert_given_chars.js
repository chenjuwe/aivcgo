#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

function printHelp() {
  console.log(`\nUsage: node scripts/convert_given_chars.js --input=FILE.csv --output=FILE.json [--delimiter=,] \
  [--char=char] [--weight=weight] [--strokes=strokes] [--rare=rare] [--structure=structure] [--poly=poly] [--freq=freqRank] [--tags=tags]

CSV requirements:
- Header row present
- Tags column can be pipe- or comma-separated
- Rare/Poly columns treated as truthy if value in {1,true,yes}
`);
}

function parseArgs(argv) {
  const args = {};
  for (const a of argv.slice(2)) {
    if (a === '--help' || a === '-h') return { help: true };
    const [k, v] = a.replace(/^--/, '').split('=');
    args[k] = v ?? true;
  }
  return args;
}

function parseCSV(text, delimiter) {
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  const d = delimiter === 'tab' ? '\t' : (delimiter || ',');
  while (i < text.length) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (!inQuotes && (c === d || c === '\n' || c === '\r')) {
      row.push(field); field = '';
      if (c === '\n' || c === '\r') { if (row.length > 1 || row[0] !== '') rows.push(row); row = []; }
    } else {
      field += c;
    }
    i++;
  }
  if (field.length > 0 || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ''));
}

function truthy(v) {
  return ['1', 'true', 'yes', 'y'].includes(String(v).trim().toLowerCase());
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.input || !args.output) { printHelp(); process.exit(args.help ? 0 : 1); }
  const delimiter = args.delimiter || ',';
  const col = (name, def) => (args[name] || def);

  const raw = fs.readFileSync(path.resolve(args.input), 'utf8');
  const rows = parseCSV(raw, delimiter);
  if (rows.length < 2) { console.error('CSV appears empty'); process.exit(1); }
  const header = rows[0];
  const colIdx = (name) => header.findIndex(h => h.trim().toLowerCase() === String(name).trim().toLowerCase());

  const idx = {
    char: colIdx(col('char', 'char')),
    weight: colIdx(col('weight', 'weight')),
    strokes: colIdx(col('strokes', 'strokes')),
    rare: colIdx(col('rare', 'rare')),
    structure: colIdx(col('structure', 'structure')),
    poly: colIdx(col('poly', 'poly')),
    freq: colIdx(col('freq', 'freqRank')),
    tags: colIdx(col('tags', 'tags')),
  };

  const out = rows.slice(1).map(r => {
    const tagsRaw = idx.tags >= 0 ? (r[idx.tags] || '') : '';
    const tags = tagsRaw.split(/[|,]/).map(s => s.trim()).filter(Boolean);
    return {
      char: (idx.char >= 0 ? r[idx.char] : '').trim(),
      weight: Number(idx.weight >= 0 ? r[idx.weight] : 0),
      strokes: Number(idx.strokes >= 0 ? r[idx.strokes] : 0),
      rare: idx.rare >= 0 ? truthy(r[idx.rare]) : false,
      structure: idx.structure >= 0 ? (r[idx.structure] || '').trim() : undefined,
      polyphonic: idx.poly >= 0 ? truthy(r[idx.poly]) : false,
      freqRank: idx.freq >= 0 ? Number(r[idx.freq]) : undefined,
      tags: tags.length ? tags : undefined,
    };
  }).filter(x => x.char);

  const outPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} characters to ${outPath}`);
}

if (require.main === module) main(); 
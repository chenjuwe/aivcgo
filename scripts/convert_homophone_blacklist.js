#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

function printHelp() {
  console.log(`\nUsage: node scripts/convert_homophone_blacklist.js --inputs=a.csv,b.csv,c.txt --output=FILE.json [--delimiter=,] [--column=word]

- Accepts CSV or plain text; for text, one entry per line
- CSV: specify column name by --column (default: word)
- Dedupes and trims entries`);
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

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.inputs || !args.output) { printHelp(); process.exit(args.help ? 0 : 1); }
  const files = String(args.inputs).split(',').map(s => s.trim()).filter(Boolean);
  const delimiter = args.delimiter || ',';
  const column = args.column || 'word';

  const set = new Set();
  for (const f of files) {
    const raw = fs.readFileSync(path.resolve(f), 'utf8');
    const isCSV = f.endsWith('.csv') || f.endsWith('.tsv');
    if (!isCSV) {
      raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean).forEach(x => set.add(x));
      continue;
    }
    const rows = parseCSV(raw, delimiter);
    if (rows.length < 2) continue;
    const header = rows[0];
    const idx = header.findIndex(h => h.trim().toLowerCase() === column.toLowerCase());
    if (idx < 0) continue;
    for (const r of rows.slice(1)) {
      const v = (r[idx] || '').trim();
      if (v) set.add(v);
    }
  }

  const out = Array.from(set.values()).sort((a, b) => a.localeCompare(b));
  const outPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} entries to ${outPath}`);
}

if (require.main === module) main(); 
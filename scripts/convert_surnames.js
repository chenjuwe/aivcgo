#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

function printHelp() {
  console.log(`\nUsage: node scripts/convert_surnames.js --input=FILE.csv --output=FILE.json [--delimiter=,] [--surname=Surname] [--weight=Weight]

CSV requirements:
- Header row present
- Default columns: surname, weight (can be overridden)
- Delimiter: default comma, support tab by --delimiter=tab

Example:
  node scripts/convert_surnames.js --input=data/surnames_top100.csv --output=src/utils/data/surnames_tw.json --surname=name --weight=frequency
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
  // Basic CSV parser supporting quoted fields
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
  // Normalize CRLF empty rows
  const normalized = rows.filter(r => r.some(x => x.trim() !== ''));
  return normalized;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.input || !args.output) { printHelp(); process.exit(args.help ? 0 : 1); }
  const surnameCol = args.surname || 'surname';
  const weightCol = args.weight || 'weight';
  const delimiter = args.delimiter || ',';

  const raw = fs.readFileSync(path.resolve(args.input), 'utf8');
  const rows = parseCSV(raw, delimiter);
  if (rows.length < 2) { console.error('CSV appears empty'); process.exit(1); }
  const header = rows[0];
  const colIdx = (name) => header.findIndex(h => h.trim().toLowerCase() === String(name).trim().toLowerCase());
  const iSurname = colIdx(surnameCol);
  const iWeight = colIdx(weightCol);
  if (iSurname < 0 || iWeight < 0) {
    console.error('Missing required columns. Header:', header);
    process.exit(1);
  }
  const out = rows.slice(1).map(r => ({
    surname: (r[iSurname] || '').trim(),
    weight: Number(r[iWeight] || 0)
  })).filter(x => x.surname);

  out.sort((a, b) => b.weight - a.weight);
  const outPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} surnames to ${outPath}`);
}

if (require.main === module) main(); 
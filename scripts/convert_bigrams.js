#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

function printHelp() {
  console.log(`\nUsage: node scripts/convert_bigrams.js --input=FILE.csv --output=FILE.json [--delimiter=,] \
  [--first=first] [--second=second] [--weight=weight] [--gender=gender] [--era=era] [--region=region]
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
    first: colIdx(col('first', 'first')),
    second: colIdx(col('second', 'second')),
    weight: colIdx(col('weight', 'weight')),
    gender: colIdx(col('gender', 'gender')),
    era: colIdx(col('era', 'era')),
    region: colIdx(col('region', 'region')),
  };

  const out = rows.slice(1).map(r => ({
    first: (idx.first >= 0 ? r[idx.first] : '').trim(),
    second: (idx.second >= 0 ? r[idx.second] : '').trim(),
    weight: Number(idx.weight >= 0 ? r[idx.weight] : 0),
    gender: idx.gender >= 0 ? (r[idx.gender] || '').trim() : undefined,
    era: idx.era >= 0 ? (r[idx.era] || '').trim() : undefined,
    region: idx.region >= 0 ? (r[idx.region] || '').trim() : undefined,
  })).filter(x => x.first && x.second);

  const outPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} bigrams to ${outPath}`);
}

if (require.main === module) main(); 
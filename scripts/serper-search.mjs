#!/usr/bin/env node
/**
 * serper-search.mjs — Query Serper Google Search API.
 *
 * Usage:
 *   node scripts/serper-search.mjs "AI jobs Europe"          # web search
 *   node scripts/serper-search.mjs "AI jobs Europe" --news   # news search
 *   node scripts/serper-search.mjs "AI jobs Europe" --images # image search
 *   node scripts/serper-search.mjs "AI jobs Europe" -n 3     # limit results
 *
 * API key stored in GCP Secret Manager (serper-api-key).
 * Docs: https://serper.dev/docs
 */

import { execSync } from 'child_process';

const API_KEY = execSync('gcloud secrets versions access latest --secret=serper-api-key --project=worktugal 2>/dev/null').toString().trim();

if (!API_KEY) {
  console.error('Error: Could not fetch Serper API key from GCP Secret Manager.');
  console.error('Ensure gcloud is authenticated and secret exists: serper-api-key');
  process.exit(1);
}

const args = process.argv.slice(2);
const searchType = args.includes('--news') ? 'news' : args.includes('--images') ? 'images' : 'search';
const limitFlag = args.indexOf('-n');
const limit = limitFlag !== -1 ? parseInt(args[limitFlag + 1]) || 5 : 5;

const query = args.filter(a => !a.startsWith('-') && a !== String(limit) && !['--news', '--images'].includes(a)).join(' ');

if (!query) {
  console.error('Usage: node scripts/serper-search.mjs "your query" [--news|--images] [-n 5]');
  process.exit(1);
}

const body = JSON.stringify({ q: query, num: limit });
const endpoint = searchType === 'news'
  ? 'https://google.serper.dev/news'
  : searchType === 'images'
  ? 'https://google.serper.dev/images'
  : 'https://google.serper.dev/search';

try {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' },
    body
  });
  const data = await res.json();

  if (data.searchInformation) {
    console.log(`\n  "${query}" — ${data.searchInformation.totalResults} results\n`);
  }

  const results = data.organic || data.news || data.images || [];
  results.slice(0, limit).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.title}`);
    console.log(`     ${r.link}`);
    if (r.snippet) console.log(`     ${r.snippet.substring(0, 150)}`);
    if (r.date) console.log(`     ${r.date}`);
    console.log();
  });
} catch (err) {
  console.error('Serper API error:', err.message);
  process.exit(1);
}

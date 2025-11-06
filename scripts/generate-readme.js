#!/usr/bin/env node

/**
 * README Generator Script
 *
 * This script automatically generates/updates the README.md file by:
 * 1. Scanning recent Supabase migrations for database changes
 * 2. Reading changelog entries from the project_changelog table
 * 3. Analyzing current codebase structure
 * 4. Combining everything into the comprehensive README format
 *
 * Usage:
 *   node scripts/generate-readme.js
 *   npm run generate-readme
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getRecentChangelog(days = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const { data, error } = await supabase
    .from('project_changelog')
    .select('*')
    .gte('date', cutoffDate.toISOString().split('T')[0])
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching changelog:', error);
    return [];
  }

  return data || [];
}

function getRecentMigrations(days = 30) {
  const migrationsDir = path.join(projectRoot, 'supabase', 'migrations');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  const files = fs.readdirSync(migrationsDir);
  return files
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const stats = fs.statSync(path.join(migrationsDir, file));
      return {
        name: file,
        date: stats.mtime,
        path: path.join(migrationsDir, file)
      };
    })
    .filter(file => file.date >= cutoffDate)
    .sort((a, b) => b.date - a.date);
}

function formatChangelogEntry(entry) {
  let text = `**${entry.date}: ${entry.title}**\n`;

  if (entry.details) {
    text += `${entry.details}\n`;
  }

  if (entry.affected_files && entry.affected_files.length > 0) {
    text += `- Files changed: ${entry.affected_files.join(', ')}\n`;
  }

  if (entry.migration_files && entry.migration_files.length > 0) {
    text += `- Migrations: ${entry.migration_files.join(', ')}\n`;
  }

  if (entry.version) {
    text += `- Version: ${entry.version}\n`;
  }

  return text;
}

async function generateReadmeUpdates() {
  console.log('🔍 Scanning for recent changes...');

  const changelog = await getRecentChangelog(90);
  const migrations = getRecentMigrations(30);

  console.log(`📋 Found ${changelog.length} changelog entries`);
  console.log(`🗄️  Found ${migrations.length} recent migrations`);

  if (changelog.length === 0 && migrations.length === 0) {
    console.log('✅ No new changes to document');
    return null;
  }

  let updates = '## Recent Updates (Generated)\n\n';

  if (changelog.length > 0) {
    updates += '### Logged Changes\n\n';
    changelog.forEach(entry => {
      updates += formatChangelogEntry(entry) + '\n';
    });
  }

  if (migrations.length > 0) {
    updates += '\n### Recent Migrations\n\n';
    migrations.forEach(migration => {
      updates += `- ${migration.name} (${migration.date.toISOString().split('T')[0]})\n`;
    });
  }

  return updates;
}

async function main() {
  console.log('📚 README Generator');
  console.log('==================\n');

  const updates = await generateReadmeUpdates();

  if (!updates) {
    console.log('✅ README is up to date');
    return;
  }

  const readmePath = path.join(projectRoot, 'README.md');
  const currentReadme = fs.readFileSync(readmePath, 'utf8');

  const today = new Date().toISOString().split('T')[0];
  const updatedReadme = currentReadme.replace(
    /\*\*Last Updated:\*\* \d{4}-\d{2}-\d{2}/,
    `**Last Updated:** ${today}`
  );

  const outputPath = path.join(projectRoot, 'README_UPDATES.md');
  fs.writeFileSync(outputPath, updates);

  console.log(`\n✅ Generated update summary: ${outputPath}`);
  console.log('\n📝 To apply these changes:');
  console.log('   1. Review the updates in README_UPDATES.md');
  console.log('   2. Manually merge them into README.md under "Recent Updates"');
  console.log('   3. Or use the AI helper prompt: "Merge README_UPDATES.md into README.md"');
  console.log('\n💡 Tip: Log changes as you work using /admin/changelog');
}

main().catch(console.error);

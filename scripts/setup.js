#!/usr/bin/env node

/**
 * CFBC Setup Script
 *
 * Reusable command to bootstrap/rebuild the project:
 *   npm run setup
 *
 * This script:
 *  1. Verifies Node.js version
 *  2. Checks dependencies are installed
 *  3. Validates Firebase config
 *  4. Runs a build
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: root, stdio: 'inherit' });
}

function check(label, condition) {
  const icon = condition ? '[OK]' : '[!!]';
  console.log(`${icon} ${label}`);
  return condition;
}

console.log('\n=== CFBC Project Setup ===\n');

// 1. Node version
const [major] = process.versions.node.split('.').map(Number);
check(`Node.js v${process.versions.node} (need >= 18)`, major >= 18);

// 2. Dependencies
if (!existsSync(resolve(root, 'node_modules'))) {
  console.log('\nInstalling dependencies...');
  run('npm install');
} else {
  check('node_modules present', true);
}

// 3. Firebase config
const configPath = resolve(root, 'src/firebase-config.js');
const configContent = readFileSync(configPath, 'utf8');
const configured = !configContent.includes('YOUR_API_KEY');
check(`Firebase config (${configured ? 'configured' : 'placeholder - update src/firebase-config.js'})`, configured);

// 4. Build
console.log('\nBuilding project...');
run('npx vite build');

console.log('\n=== Setup Complete ===');
console.log('Run "npm run dev" to start the dev server on http://localhost:3000');
console.log('');

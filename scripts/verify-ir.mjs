#!/usr/bin/env node
/**
 * Deploy guard for the career-fair landing page.
 *
 * The URL https://ishani.kathuria.net/ir is printed on physical media (QR codes
 * on the paper résumé + NFC tags for Purdue Industrial Roundtable). It MUST NOT
 * move or break. This script runs on `predeploy` and fails the deploy if any of
 * the critical, physically-referenced files are missing.
 *
 * If you intend to change these paths, you must also reprint the QR codes and
 * reprogram the NFC tags — so this guard is deliberately strict.
 */
import { existsSync, readFileSync } from 'node:fs';

const required = [
  'public/ir/index.html', // the landing page itself (route: /ir)
  'public/ir/ishani-kathuria.vcf', // Save-contact vCard
  'public/resume.pdf', // Download-résumé target (clean, no-QR PDF)
  'public/404.html', // catches case-variants (/IR, /Ir, /iR) -> /ir on GitHub Pages
];

const missing = required.filter((f) => !existsSync(f));
if (missing.length) {
  console.error('\n[31m✗ /ir deploy guard FAILED — missing physically-referenced files:[0m');
  for (const f of missing) console.error('   - ' + f);
  console.error('\nThese paths are on printed QR codes / NFC tags and cannot move.\n');
  process.exit(1);
}

// Sanity-check the vCard has the essential fields.
const vcf = readFileSync('public/ir/ishani-kathuria.vcf', 'utf8');
const vcardNeeds = ['BEGIN:VCARD', 'FN:Ishani Kathuria', 'EMAIL', 'TEL', 'linkedin.com/in/ishani-kathuria', 'github.com/ikathuria', 'END:VCARD'];
const vcardMissing = vcardNeeds.filter((s) => !vcf.includes(s));
if (vcardMissing.length) {
  console.error('\n[31m✗ /ir deploy guard FAILED — vCard missing fields:[0m ' + vcardMissing.join(', ') + '\n');
  process.exit(1);
}

console.log('[32m✓ /ir deploy guard passed[0m (landing page, vCard, résumé, and case-variant redirects present).');

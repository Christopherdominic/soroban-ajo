#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * Runs axe-core accessibility tests on key pages
 */

const { chromium } = require('playwright');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const pages = [
  { name: 'Home', url: 'http://localhost:3000' },
  { name: 'Dashboard', url: 'http://localhost:3000/dashboard' },
  { name: 'Groups', url: 'http://localhost:3000/groups' },
  { name: 'Profile', url: 'http://localhost:3000/profile' },
];

async function runAccessibilityTests() {
  process.stdout.write('🔍 Starting accessibility tests...\n\n');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  let totalViolations = 0;
  const results = [];

  for (const testPage of pages) {
    process.stdout.write(`Testing: ${testPage.name} (${testPage.url})\n`);

    try {
      await page.goto(testPage.url, { waitUntil: 'networkidle' });

      const accessibilityResults = await page.evaluate(async () => {
        const axe = require('axe-core');
        return await axe.run();
      });

      const violations = accessibilityResults.violations;
      totalViolations += violations.length;

      results.push({
        page: testPage.name,
        url: testPage.url,
        violations: violations.length,
        passes: accessibilityResults.passes.length,
        details: violations,
      });

      if (violations.length === 0) {
        process.stdout.write(`✅ No violations found\n\n`);
      } else {
        process.stdout.write(`❌ Found ${violations.length} violations:\n`);
        violations.forEach((violation, index) => {
          process.stdout.write(`  ${index + 1}. ${violation.id}: ${violation.description}\n`);
          process.stdout.write(`     Impact: ${violation.impact}\n`);
          process.stdout.write(`     Affected elements: ${violation.nodes.length}\n`);
        });
        process.stdout.write('\n');
      }
    } catch (error) {
      process.stderr.write(`Error testing ${testPage.name}: ${error.message}\n`);
    }
  }

  await browser.close();

  // Summary
  process.stdout.write('\n📊 Test Summary:\n');
  process.stdout.write(`Total pages tested: ${pages.length}\n`);
  process.stdout.write(`Total violations: ${totalViolations}\n`);

  results.forEach((result) => {
    const status = result.violations === 0 ? '✅' : '❌';
    process.stdout.write(`${status} ${result.page}: ${result.violations} violations, ${result.passes} passes\n`);
  });

  // Exit with error if violations found
  if (totalViolations > 0) {
    process.stdout.write('\n❌ Accessibility tests failed\n');
    process.exit(1);
  } else {
    process.stdout.write('\n✅ All accessibility tests passed!\n');
    process.exit(0);
  }
}

runAccessibilityTests().catch((error) => {
  process.stderr.write(`Fatal error: ${error}\n`);
  process.exit(1);
});

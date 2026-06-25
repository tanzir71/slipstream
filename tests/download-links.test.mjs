import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const root = new URL('../', import.meta.url);

const downloadFiles = [
  'download/slipstream-windows-x64-setup.exe',
  'download/slipstream-windows-x64.msi',
  'download/slipstream-windows-sha256.txt',
  'download/slipstream-macos.dmg',
  'download/slipstream-macos.zip',
  'download/slipstream-linux-x64.AppImage',
  'download/slipstream-linux-x64.deb',
  'download/slipstream-linux-sha256.txt',
];

test('top navigation download CTA is visibly active', () => {
  assert.match(html, /<a class="nav-cta btn btn-primary"[^>]+href="#download"[^>]*>Downloads<\/a>/);
  assert.match(html, /\.nav-links \.nav-cta\{[^}]*color:#fff/);
});

test('download section offers Windows, macOS, and Linux builds', () => {
  for (const platform of ['Windows', 'macOS', 'Linux']) {
    assert.match(html, new RegExp(`<h3>${platform}</h3>`));
  }

  for (const file of downloadFiles) {
    assert.match(html, new RegExp(`href="${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.ok(existsSync(new URL(file, root)), `${file} should exist`);
  }
});

test('narrow screens get compact nav and hero rules', () => {
  assert.match(html, /@media\(max-width:520px\)[\s\S]*\.nav-links \.nav-cta\{/);
  assert.match(html, /@media\(max-width:520px\)[\s\S]*h1\{/);
  assert.match(html, /@media\(max-width:520px\)[\s\S]*\.badge\{/);
  assert.match(html, /<span class="desktop-tail"> from your desktop\.<\/span>/);
  assert.match(html, /@media\(max-width:520px\)[\s\S]*\.desktop-tail\{display:block/);
});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const {
  assertCommandSucceeded,
  checkIconContract,
  readPngMetadata,
} = require('./check-icon-contract');

test('desktop icon assets and packaging follow one contract', () => {
  const checks = checkIconContract();

  assert.equal(checks.length, 5);
  assert.ok(checks.includes('ICNS generated from the shared master'));
  assert.ok(checks.includes('16px and 32px macOS template Tray icons'));
});

test('PNG metadata parser reports a truncated chunk without a RangeError', () => {
  const sourcePath = path.resolve(__dirname, '../resources/trayTemplate.png');
  const source = fs.readFileSync(sourcePath);
  const chunkTypeOffset = source.indexOf(Buffer.from('pHYs'));
  assert.notEqual(chunkTypeOffset, -1);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'banana-truncated-png-'));
  const truncatedPath = path.join(tempDir, 'truncated.png');
  try {
    fs.writeFileSync(truncatedPath, source.subarray(0, chunkTypeOffset + 8));
    assert.throws(
      () => readPngMetadata(truncatedPath),
      /truncated pHYs chunk/,
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('command failures include spawn errors', () => {
  assert.throws(
    () => assertCommandSucceeded({
      status: null,
      stdout: '',
      stderr: '',
      error: new Error('spawn iconutil ENOENT'),
    }, 'iconutil'),
    /spawn iconutil ENOENT/,
  );
});

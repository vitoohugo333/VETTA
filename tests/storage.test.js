import test from 'node:test';
import assert from 'node:assert/strict';
import { exportBackup, importBackup } from '../src/data/storage.js';

test('backup preserva registros e custos ao ser importado', () => {
  const original = {
    configured: true,
    targetProfit: 3500,
    records: [{ date: '2026-08-01', gross: 320, km: 140 }],
    costs: [{ id: 'insurance', name: 'Seguro', kind: 'monthly', value: 200, active: true }],
  };
  const restored = importBackup(exportBackup(original));
  assert.deepEqual(restored.records, original.records);
  assert.deepEqual(restored.costs, original.costs);
  assert.equal(restored.targetProfit, 3500);
});

test('rejeita arquivo sem registros e custos', () => {
  assert.throws(() => importBackup('{"data":{}}'), /backup VETTA válido/);
});

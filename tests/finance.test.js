import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMonth, calculateRecord, createInitialState, summarizeCosts } from '../src/domain/finance.js';

test('converte custo semanal para equivalente mensal', () => {
  assert.equal(summarizeCosts([{ active: true, kind: 'weekly', value: 100 }]).monthly, 433.3333333333333);
});

test('calcula o líquido diário com combustível, custo por km e parcela fixa', () => {
  const state = createInitialState();
  state.workWeekdays = [1, 2, 3, 4, 5];
  state.fuel = { price: 5, efficiency: 10 };
  state.costs = [
    { active: true, kind: 'monthly', value: 220 },
    { active: true, kind: 'per_km', value: 0.2 },
  ];
  const record = calculateRecord({ date: '2026-08-03', gross: 300, km: 100 }, state, new Date(2026, 7, 3));
  assert.equal(record.fuel, 50);
  assert.equal(record.variable, 20);
  assert.equal(record.fixedShare, 220 / 21);
  assert.equal(record.net, 300 - 50 - 20 - (220 / 21));
});

test('registro de combustível informado substitui a estimativa', () => {
  const state = createInitialState();
  const record = calculateRecord({ date: '2026-08-03', gross: 200, km: 100, fuelSpend: 70 }, state, new Date(2026, 7, 3));
  assert.equal(record.fuel, 70);
});

test('meta diária considera apenas registros do mês em análise', () => {
  const state = createInitialState();
  state.records = [
    { date: '2026-07-31', gross: 500, km: 100 },
    { date: '2026-08-03', gross: 300, km: 100 },
  ];
  const result = calculateMonth(state, new Date(2026, 7, 4));
  assert.equal(result.records.length, 1);
  assert.ok(result.dailyGross > 0);
});

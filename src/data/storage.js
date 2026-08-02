import { createInitialState } from '../domain/finance.js';

const STORAGE_KEY = 'vetta.local.v1';

export function loadState(storage = localStorage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
    if (!saved || !Array.isArray(saved.records) || !Array.isArray(saved.costs)) return createInitialState();
    return { ...createInitialState(), ...saved };
  } catch {
    return createInitialState();
  }
}

export function saveState(state, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportBackup(state) {
  return JSON.stringify({ app: 'VETTA', schemaVersion: 1, exportedAt: new Date().toISOString(), data: state }, null, 2);
}

export function importBackup(text) {
  const parsed = JSON.parse(text);
  const data = parsed.data || parsed;
  if (!Array.isArray(data.records) || !Array.isArray(data.costs)) throw new Error('Arquivo não contém um backup VETTA válido.');
  return { ...createInitialState(), ...data, configured: true };
}

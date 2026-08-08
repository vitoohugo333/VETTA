export class UiStore {
  constructor(onChange = () => {}) {
    this.onChange = onChange;
    this.state = {
      route: 'dashboard', primary: 'dashboard', planningSection: null,
      historySection: null, resultDetail: null, moreSection: null,
      recordReturn: 'dashboard', recordEditingDate: null, recordConfirmationDate: null,
      lastRecordUpdated: false, onboardingStep: 1, costModalOpen: false,
      costEditingId: null, eventModalOpen: false, eventEditingId: null,
      importCandidate: null, installOpen: false, notificationsOpen: false,
    };
  }
  bootstrap(patch = {}) {
    this.state = { ...this.state, ...patch };
    const current = history.state;
    if (current?.vettaPremium) this.state = { ...this.state, ...current.ui };
    else history.replaceState({ vettaPremium: true, ui: this.snapshot() }, '', location.href);
    addEventListener('popstate', event => {
      if (event.state?.vettaPremium) {
        this.state = { ...this.state, ...event.state.ui };
        this.onChange(this.state);
      }
    });
  }
  snapshot() { return { ...this.state, importCandidate: null }; }
  commit(replace = false) {
    const value = { vettaPremium: true, ui: this.snapshot() };
    if (replace) history.replaceState(value, '', location.href);
    else history.pushState(value, '', location.href);
    this.onChange(this.state);
  }
  set(patch, { historyMode = 'replace' } = {}) {
    this.state = { ...this.state, ...patch };
    this.commit(historyMode === 'replace');
  }
  push(patch) { this.state = { ...this.state, ...patch }; this.commit(false); }
  replace(patch) { this.state = { ...this.state, ...patch }; this.commit(true); }
  primary(view) {
    if (view === 'costs') return this.push({ route: 'planning', primary: 'costs', planningSection: 'costs', historySection: null, resultDetail: null, moreSection: null });
    this.push({ route: view, primary: view, planningSection: null, historySection: null, resultDetail: null, moreSection: null });
  }
  secondary(route, patch = {}) {
    this.push({ route, ...patch });
  }
  back(fallback = { route: this.state.primary, primary: this.state.primary }) {
    if (history.length > 1) history.back();
    else this.replace(fallback);
  }
}

(() => {
  const app = window.__vettaApp;
  const root = document.getElementById('view-day');
  if (!app || !root || root.dataset.block2 === 'ready') return;

  const dateInput = document.getElementById('recordDate');
  const grossInput = document.getElementById('recordGross');
  const kmInput = document.getElementById('recordKm');
  const hoursInput = document.getElementById('recordHours');
  const fuelInput = document.getElementById('recordFuel');
  const previewCost = document.getElementById('previewCost');
  const previewNet = document.getElementById('previewNet');
  const previewRevenueKm = document.getElementById('previewRevenueKm');
  const previewDelta = document.getElementById('previewDelta');
  const previewExplanation = document.getElementById('previewExplanation');
  const saveButton = document.getElementById('saveDayButton');
  const clearButton = document.getElementById('clearDayButton');

  const formCard = dateInput?.closest('.card-vetta');
  const primaryGrid = grossInput?.closest('.grid');
  const optionalGrid = hoursInput?.closest('.grid');
  const previewCard = previewCost?.closest('.card-vetta');
  const previewGrid = previewCost?.closest('.grid');
  const hero = Array.from(root.children).find(element => element.querySelector('h2')?.textContent.trim() === 'Registro do dia');
  const heroText = hero?.querySelector('p');

  const required = [
    dateInput,
    grossInput,
    kmInput,
    hoursInput,
    fuelInput,
    previewCost,
    previewNet,
    previewRevenueKm,
    previewDelta,
    previewExplanation,
    saveButton,
    clearButton,
    formCard,
    primaryGrid,
    optionalGrid,
    previewCard,
    previewGrid,
    hero,
    heroText,
  ];

  if (required.some(item => !item)) {
    console.warn('Bloco 2 não aplicado: o formulário original foi preservado porque falta um elemento obrigatório.');
    return;
  }

  heroText.textContent = 'Faturamento e quilômetros primeiro. Os detalhes opcionais ficam disponíveis quando você precisar.';

  const essentialIntro = document.createElement('div');
  essentialIntro.dataset.recordRole = 'essential-intro';
  essentialIntro.innerHTML = `
    <span class="label-micro !text-blue-600">Essencial</span>
    <p class="text-xs text-slate-500">Esses dois números são suficientes para calcular o resultado do dia.</p>`;
  formCard.insertBefore(essentialIntro, primaryGrid);
  primaryGrid.dataset.recordRole = 'essential-fields';

  const optionalDetails = document.createElement('details');
  optionalDetails.id = 'recordOptionalDetails';
  optionalDetails.className = 'rounded-2xl bg-slate-50 overflow-hidden';
  optionalDetails.innerHTML = `
    <summary class="details-summary px-4 py-4">
      <div>
        <span class="label-micro !mb-0 !text-vetta-900">Detalhes opcionais</span>
        <strong>Adicionar horas e combustível gasto</strong>
      </div>
      <i class="fas fa-chevron-down"></i>
    </summary>
    <div data-record-optional-body class="px-4 pb-4 space-y-3">
      <p class="text-xs text-slate-500">Você pode salvar sem preencher esta parte.</p>
    </div>`;
  optionalDetails.querySelector('[data-record-optional-body]').appendChild(optionalGrid);
  optionalGrid.dataset.recordRole = 'optional-fields';
  formCard.appendChild(optionalDetails);

  const previewLabel = previewCard.querySelector('.label-micro');
  if (previewLabel) previewLabel.textContent = 'Resultado antes de salvar';
  const netCard = previewNet.parentElement;
  netCard.classList.add('col-span-2', 'text-center');
  previewNet.classList.add('block', 'text-3xl', 'font-black', 'mt-1');
  previewGrid.prepend(netCard);
  previewCard.dataset.recordRole = 'preview';

  const confirmation = document.createElement('section');
  confirmation.id = 'recordConfirmation';
  confirmation.hidden = true;
  confirmation.className = 'card-vetta p-6 space-y-5';
  confirmation.innerHTML = `
    <div class="text-center">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center text-xl"><i class="fas fa-check"></i></div>
      <span class="label-micro !text-emerald-700 mt-4">Registro concluído</span>
      <h3 id="recordConfirmationTitle" class="text-2xl font-extrabold">Dia registrado</h3>
      <p id="recordConfirmationText" class="text-xs text-slate-500 mt-2"></p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-slate-50 rounded-2xl p-4"><span class="label-micro">Faturamento</span><strong id="recordConfirmationGross" class="text-lg"></strong></div>
      <div class="bg-slate-50 rounded-2xl p-4"><span class="label-micro">Quilômetros</span><strong id="recordConfirmationKm" class="text-lg"></strong></div>
      <div class="col-span-2 bg-emerald-50 rounded-2xl p-5 text-center"><span class="label-micro !text-emerald-700">Líquido calculado</span><strong id="recordConfirmationNet" class="block text-3xl font-black text-emerald-600"></strong></div>
    </div>
    <button id="recordDoneButton" class="w-full py-4 rounded-2xl bg-blue-600 text-white text-sm font-extrabold shadow-float">Concluir</button>
    <button id="recordEditButton" class="w-full py-3 text-xs font-bold text-blue-600">Editar este dia</button>`;
  root.appendChild(confirmation);

  const formElements = [hero, formCard, previewCard, saveButton, clearButton];
  let confirmationActive = false;
  let confirmationDate = null;

  const setMode = mode => {
    const showConfirmation = mode === 'confirmation';
    formElements.forEach(element => {
      element.hidden = showConfirmation;
      element.setAttribute('aria-hidden', String(showConfirmation));
    });
    confirmation.hidden = !showConfirmation;
    confirmation.setAttribute('aria-hidden', String(!showConfirmation));
  };

  const displayDate = date => {
    const parsed = app.parseDate(date);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(parsed);
  };

  const renderConfirmation = (draft, numbers, updated) => {
    confirmationDate = draft.date;
    document.getElementById('recordConfirmationTitle').textContent = updated ? 'Dia atualizado' : 'Dia registrado';
    document.getElementById('recordConfirmationText').textContent = `${displayDate(draft.date)} foi ${updated ? 'atualizado' : 'salvo'} sem criar outro registro para a mesma data.`;
    document.getElementById('recordConfirmationGross').textContent = app.money(draft.gross);
    document.getElementById('recordConfirmationKm').textContent = `${app.integer(draft.km)} km`;
    document.getElementById('recordConfirmationNet').textContent = app.money(numbers.net);
  };

  const restoreRecord = date => {
    const record = app.state.records.find(item => item.date === date);
    if (!record) return false;
    dateInput.value = record.date;
    grossInput.value = record.gross;
    kmInput.value = record.km;
    hoursInput.value = record.hours || '';
    fuelInput.value = record.fuelSpend || '';
    optionalDetails.open = Boolean(record.hours || record.fuelSpend);
    app.renderRecordPreview();
    return true;
  };

  const baseShowView = app.showView;
  app.showView = function(view, primaryView = view) {
    baseShowView.call(this, view, primaryView);
    if (view !== 'day') return;
    if (confirmationActive) {
      setMode('confirmation');
      return;
    }
    setMode('form');
    if (hoursInput.value || fuelInput.value) optionalDetails.open = true;
  };

  const baseSaveDay = app.saveDay;
  app.saveDay = function() {
    const draft = this.recordDraft();
    if (!draft.date || draft.gross <= 0 || draft.km <= 0) return baseSaveDay.call(this);

    const updated = this.state.records.some(record => record.date === draft.date);
    const numbers = this.recordNumbers(draft);
    confirmationActive = true;
    baseSaveDay.call(this);
    renderConfirmation(draft, numbers, updated);
    this.showView('day', 'dashboard');
  };

  document.getElementById('recordDoneButton').addEventListener('click', () => {
    confirmationActive = false;
    confirmationDate = null;
    optionalDetails.open = false;
    setMode('form');
    app.showView('dashboard');
  });

  document.getElementById('recordEditButton').addEventListener('click', () => {
    if (!confirmationDate || !restoreRecord(confirmationDate)) return;
    confirmationActive = false;
    app.showView('day', 'dashboard');
  });

  clearButton.addEventListener('click', () => {
    confirmationActive = false;
    confirmationDate = null;
    optionalDetails.open = false;
    setMode('form');
  });

  setMode('form');
  root.dataset.block2 = 'ready';
})();

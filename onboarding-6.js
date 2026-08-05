(() => {
  const app = window.__vettaApp;
  const modal = document.getElementById('onboardingModal');

  if (!app || !modal || modal.dataset.block6 === 'ready') return;

  const $ = id => document.getElementById(id);
  const required = [
    $('onboardingTitle'),
    $('onboardingProgress'),
    $('onboardingBar'),
    $('onboardingStep1'),
    $('onboardingStep2'),
    $('onboardingStep3'),
    $('onboardingTarget'),
    $('onboardingFuelType'),
    $('onboardingFuelPrice'),
    $('onboardingFuelEff'),
    $('onboardingRevenue'),
    $('onboardingFixed'),
    $('onboardingBack'),
    $('onboardingNext'),
  ];

  if (required.some(item => !item)) {
    console.warn('Bloco 6 não aplicado: onboarding anterior preservado porque falta um elemento obrigatório.');
    return;
  }

  const step1 = $('onboardingStep1');
  const step2 = $('onboardingStep2');
  const step3 = $('onboardingStep3');
  const targetInput = $('onboardingTarget');
  const fuelType = $('onboardingFuelType');
  const fuelPrice = $('onboardingFuelPrice');
  const fuelEfficiency = $('onboardingFuelEff');
  const revenueInput = $('onboardingRevenue');
  const fixedInput = $('onboardingFixed');
  const nextButton = $('onboardingNext');

  const firstParagraph = step1.querySelector('p');
  const daysLabel = step1.querySelector('label');
  const secondParagraph = step2.querySelector('p');
  const thirdParagraph = step3.querySelector('p');
  const step2Labels = step2.querySelectorAll('label');
  const step3Labels = step3.querySelectorAll('label');

  if (
    !firstParagraph
    || !daysLabel
    || !secondParagraph
    || !thirdParagraph
    || step2Labels.length < 2
    || step3Labels.length < 2
  ) {
    console.warn('Bloco 6 não aplicado: textos anteriores preservados porque o formulário não corresponde ao contrato.');
    return;
  }

  firstParagraph.textContent = 'Quanto você quer manter livre no bolso depois dos custos do mês?';
  daysLabel.textContent = 'Quantos dias pretende trabalhar por semana?';
  secondParagraph.textContent = 'O preço e o rendimento definem quanto o combustível pesa em cada quilômetro.';
  step2Labels[0].textContent = 'Preço por unidade';
  step2Labels[1].textContent = 'Quantos km faz por unidade';
  thirdParagraph.textContent = 'Use uma estimativa agora. Depois, o VETTA poderá comparar com seus dias reais.';
  step3Labels[0].textContent = 'Quanto costuma faturar por km';
  step3Labels[1].textContent = 'Contas mensais pagas com o trabalho';

  const consequence = document.createElement('p');
  consequence.id = 'onboarding6Consequence';
  consequence.className = 'text-xs text-blue-700 bg-blue-50 rounded-2xl p-4 leading-relaxed';
  consequence.textContent = 'O VETTA divide sua meta pelos dias planejados e inclui combustível, manutenção e contas antes de mostrar a meta diária.';
  step1.appendChild(consequence);

  const fuelHelp = document.createElement('p');
  fuelHelp.id = 'onboarding6FuelHelp';
  fuelHelp.className = 'text-xs text-slate-500 leading-relaxed';
  step2.appendChild(fuelHelp);

  const summary = document.createElement('div');
  summary.id = 'onboarding6Summary';
  summary.className = 'bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed';
  step3.appendChild(summary);

  const maintenanceNotice = document.createElement('p');
  maintenanceNotice.id = 'onboarding6Maintenance';
  maintenanceNotice.className = 'text-xs text-emerald-700 bg-emerald-50 rounded-2xl p-4 leading-relaxed';
  maintenanceNotice.textContent = 'Também será criada uma reserva inicial de manutenção de R$ 0,18 por km. Você poderá editar ou remover depois em Planejar.';
  step3.appendChild(maintenanceNotice);

  const fuelUnits = {
    gnv: 'm³',
    gasoline: 'litro',
    ethanol: 'litro',
    diesel: 'litro',
  };

  const fuelLabels = {
    gnv: 'GNV',
    gasoline: 'Gasolina',
    ethanol: 'Etanol',
    diesel: 'Diesel',
  };

  const money = value => app.money(app.number(value));

  const syncExplanations = () => {
    const type = fuelType.value;
    const unit = fuelUnits[type] || 'unidade';
    const fuelName = fuelLabels[type] || 'Combustível';
    const days = app.onboardingDays || 6;
    const target = app.number(targetInput.value);
    const revenue = app.number(revenueInput.value) || 2.25;
    const fixed = app.number(fixedInput.value);

    fuelHelp.textContent = `${fuelName}: informe o preço por ${unit} e quantos quilômetros o veículo costuma fazer com essa unidade.`;
    summary.innerHTML = `
      <strong class="block text-slate-800 mb-2">Antes de começar, confira:</strong>
      <span class="block">Meta líquida: <strong>${money(target)}</strong> por mês.</span>
      <span class="block">Rotina: <strong>${days} dias por semana</strong>.</span>
      <span class="block">Combustível: <strong>${fuelName}</strong>, ${money(fuelPrice.value)} por ${unit}, rendendo ${app.number(fuelEfficiency.value).toFixed(1)} km/${unit}.</span>
      <span class="block">Faturamento estimado: <strong>${money(revenue)}/km</strong>.</span>
      <span class="block">Contas mensais iniciais: <strong>${money(fixed)}</strong>.</span>`;
  };

  const baseRenderOnboardingStep = app.renderOnboardingStep.bind(app);
  app.renderOnboardingStep = function() {
    baseRenderOnboardingStep();

    const titles = [
      'Qual é sua meta líquida?',
      'Qual combustível entra nas metas?',
      'Vamos conferir seu planejamento',
    ];
    const buttonLabels = [
      'Continuar para combustível',
      'Continuar para revisão',
      'Montar minha meta',
    ];

    $('onboardingTitle').textContent = titles[this.onboardingStep - 1];
    nextButton.textContent = buttonLabels[this.onboardingStep - 1];
    $('onboardingProgress').setAttribute('aria-label', `Etapa ${this.onboardingStep} de 3`);
    syncExplanations();
  };

  [targetInput, fuelPrice, fuelEfficiency, revenueInput, fixedInput].forEach(input => {
    input.addEventListener('input', syncExplanations);
  });
  fuelType.addEventListener('change', () => requestAnimationFrame(syncExplanations));
  modal.querySelectorAll('[data-onboarding-days]').forEach(button => {
    button.addEventListener('click', () => requestAnimationFrame(syncExplanations));
  });

  const basePrepareOnboarding = app.prepareOnboarding.bind(app);
  app.prepareOnboarding = function() {
    basePrepareOnboarding();
    if (!this.state.onboardingComplete) this.renderOnboardingStep();
  };

  modal.dataset.block6 = 'ready';
  syncExplanations();

  if (!app.state.onboardingComplete && !modal.classList.contains('hidden')) {
    app.renderOnboardingStep();
  }
})();

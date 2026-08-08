(() => {
  const app = window.__vettaApp;
  const modal = document.getElementById('onboardingModal');

  if (!app || !modal || modal.dataset.block6 === 'ready') return;

  const INITIAL_REVENUE_PER_KM = 1.75;
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
  const fixedWrap = fixedInput.closest('div');

  if (
    !firstParagraph
    || !daysLabel
    || !secondParagraph
    || !thirdParagraph
    || step2Labels.length < 2
    || step3Labels.length < 2
    || !fixedWrap
  ) {
    console.warn('Bloco 6 não aplicado: textos anteriores preservados porque o formulário não corresponde ao contrato.');
    return;
  }

  firstParagraph.textContent = 'Quanto você quer manter livre no bolso depois dos custos do mês?';
  daysLabel.textContent = 'Quantos dias pretende trabalhar por semana?';
  secondParagraph.textContent = 'O preço e o rendimento definem quanto o combustível pesa em cada quilômetro.';
  step2Labels[0].textContent = 'Preço por unidade';
  step2Labels[1].textContent = 'Quantos km faz por unidade';
  thirdParagraph.textContent = 'Use uma estimativa agora. Depois, o VETTA compara com seus dias reais e você adiciona suas contas em Planejar.';
  step3Labels[0].textContent = 'Quanto costuma faturar por km';

  fixedInput.value = '0';
  fixedWrap.hidden = true;
  fixedWrap.classList.add('hidden');
  fixedWrap.setAttribute('aria-hidden', 'true');
  fixedWrap.dataset.relocatedTo = 'Planejar → Custos e reservas';

  const consequence = document.createElement('p');
  consequence.id = 'onboarding6Consequence';
  consequence.className = 'text-xs text-blue-700 bg-blue-50 rounded-2xl p-4 leading-relaxed';
  consequence.textContent = 'O VETTA divide sua meta pelos dias planejados e considera combustível e manutenção antes de mostrar a meta diária.';
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
  maintenanceNotice.textContent = 'Ao montar a meta, será criada apenas uma reserva inicial de manutenção de R$ 0,18 por km. Contas mensais serão adicionadas depois em Planejar.';
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
    const revenue = app.number(revenueInput.value) || INITIAL_REVENUE_PER_KM;

    fixedInput.value = '0';
    fuelHelp.textContent = `${fuelName}: informe o preço por ${unit} e quantos quilômetros o veículo costuma fazer com essa unidade.`;
    summary.innerHTML = `
      <strong class="block text-slate-800 mb-2">Antes de montar sua meta, confira:</strong>
      <span class="block">Meta líquida: <strong>${money(target)}</strong> por mês.</span>
      <span class="block">Rotina: <strong>${days} dias por semana</strong>.</span>
      <span class="block">Combustível: <strong>${fuelName}</strong>, ${money(fuelPrice.value)} por ${unit}, rendendo ${app.number(fuelEfficiency.value).toFixed(1)} km/${unit}.</span>
      <span class="block">Faturamento estimado: <strong>${money(revenue)}/km</strong>.</span>
      <span class="block mt-2 text-blue-700">Depois, adicione contas e outras reservas em Planejar.</span>`;
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

  [targetInput, fuelPrice, fuelEfficiency, revenueInput].forEach(input => {
    input.addEventListener('input', syncExplanations);
  });
  fuelType.addEventListener('change', () => requestAnimationFrame(syncExplanations));
  modal.querySelectorAll('[data-onboarding-days]').forEach(button => {
    button.addEventListener('click', () => requestAnimationFrame(syncExplanations));
  });

  const basePrepareOnboarding = app.prepareOnboarding.bind(app);
  app.prepareOnboarding = function() {
    basePrepareOnboarding();
    if (!this.state.onboardingComplete) {
      revenueInput.value = String(INITIAL_REVENUE_PER_KM);
      fixedInput.value = '0';
      this.renderOnboardingStep();
    }
  };

  modal.dataset.block6 = 'ready';
  syncExplanations();

  if (!app.state.onboardingComplete && !modal.classList.contains('hidden')) {
    revenueInput.value = String(INITIAL_REVENUE_PER_KM);
    fixedInput.value = '0';
    app.renderOnboardingStep();
  }
})();

if (!document.querySelector('script[data-vetta-module="refactor-360"]')) {
  const refactorScript = document.createElement('script');
  refactorScript.src = './refactor-360.js?v=1';
  refactorScript.async = false;
  refactorScript.dataset.vettaModule = 'refactor-360';
  document.head.appendChild(refactorScript);
}

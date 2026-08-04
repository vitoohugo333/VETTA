# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-03  
**Estado:** tentativa visual anterior revertida; interface original restaurada; CI Universal Adaptativa instalada.  
**Alteração em curso:** nenhuma mudança nova de produto; primeira prova automática da branch e do GitHub Pages.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Estado do produto

A alteração visual anterior foi revertida. Permanecem restaurados:

- navegação original `Início | Dia | Histórico | Ajustes | Mais`;
- cartões originais da tela Início;
- gráfico de distribuição da meta;
- situação semanal;
- controle do objetivo mensal;
- seletor de dias de trabalho;
- atalho de planejamento.

O próximo trabalho de produto continua sendo o contrato do Bloco 1A — construir Planejar sem retirar nada de Hoje.

## O que mudou neste bloco

Somente infraestrutura de engenharia:

- regras canônicas sincronizadas;
- workflow autônomo;
- política do GitHub Pages em `ci/branch-policy.json`;
- Playwright multi-navegador;
- prova local e publicada baseada na própria branch.

## O que permaneceu intocado

- `styles.css`, `app.js`, cálculos, dados e armazenamento;
- manifesto, service worker, cache, instalação e acesso;
- branch estável e Netlify;
- `main` como aplicativo;
- PR #1.

## Validação automática

A branch passa a receber automaticamente:

- todos os testes Node descobertos;
- Chromium móvel e desktop para mudanças funcionais;
- Firefox e WebKit para interface, navegação, armazenamento, cálculos integrados e PWA;
- comparação de arquivos relevantes com o GitHub Pages quando a mudança exigir prova publicada.

## Validação física

A interface restaurada ainda deve ser recarregada no celular para confirmação visual do estado anterior. Futuras mudanças de interface continuarão exigindo validação física após a CI.

## Aprendizado

**Aprendizado fechado:** cada branch precisa ser testável de forma independente. A hospedagem é uma evidência adicional, não a origem da estratégia.

## Próximo passo único

Confirmar a primeira CI automática e a paridade do GitHub Pages; depois retomar apenas o contrato do Bloco 1A, sem implementar produto dentro deste bloco de infraestrutura.

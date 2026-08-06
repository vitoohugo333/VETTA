<!-- VETTA_GOVERNANCE_VERSION: 2026-08-06.2 -->
# VETTA — índice técnico obrigatório

Este arquivo é o mapa de leitura para qualquer agente. Ele deve ser lido depois de `AGENTS.md` e antes de `PROJECT_STATE.md`.

## Sequência obrigatória

1. `AGENTS.md` — autoridade, escopo, fontes de verdade e forma de trabalhar;
2. `SKILLS.md` — este índice;
3. `TESTING_RULES.md` — responsabilidade autônoma por testes e CI Universal Adaptativa;
4. skill ou regra especializada aplicável;
5. `LEARNING_RULES.md` quando houver defeito, quase falha ou aprendizado;
6. `PROJECT_STATE.md` — estado atual da branch;
7. fontes vivas relevantes.

## Arquivos operacionais

| Área | Arquivo | Aplicação |
|---|---|---|
| UX de produto e fluxos mobile | `.skills/vetta-product-ux/SKILL.md` | obrigatória em diagnóstico, proposta, revisão ou mudança de experiência |
| Testes e CI | `TESTING_RULES.md` | `.github/workflows/ci-engine.yml`, `ci/branch-policy.json`, `scripts/ci/` |
| PWA, instalação, cache e acesso | `PWA_RULES.md` | testes PWA, Playwright e ambiente publicado |
| Aprendizado técnico | `LEARNING_RULES.md` | `docs/incidents/` |
| Operação prática dos testes | `tests/README.md` | testes descobertos na própria branch |
| Estado vivo | `PROJECT_STATE.md` | branch, commit, CI, deploy e validação física |

## Regra de consistência entre branches

`AGENTS.md`, `SKILLS.md`, `TESTING_RULES.md`, `PWA_RULES.md`, `LEARNING_RULES.md` e `.skills/vetta-product-ux/SKILL.md` são canônicos na `main` e devem permanecer iguais nas branches operacionais.

`PROJECT_STATE.md`, planos, incidentes e `ci/branch-policy.json` refletem o estado específico de cada branch.

## Responsabilidade do agente

Dentro de um bloco autorizado, o agente decide e executa os testes necessários conforme risco e evidência. UX deve ser analisada pela tarefa real, fluxo completo, estados, segurança dos dados, clareza dos números e validação mobile.

## Criação e uso de branches

Não criar branch nova quando a branch atual comportar o trabalho com segurança. Antes da primeira alteração funcional numa branch realmente necessária, confirme governança, estado específico, política da CI e fotografia de origem.

Branches temporárias ou históricas que receberam arquivos canônicos continuam temporárias ou históricas; a presença da skill não autoriza reutilização.

## Fechamento

Todo bloco técnico termina com estado atualizado, evidência fresca e uma das situações de aprendizado previstas em `LEARNING_RULES.md`.

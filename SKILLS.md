<!-- VETTA_GOVERNANCE_VERSION: 2026-08-07.1 -->
# VETTA — índice técnico obrigatório

Este arquivo é o mapa de leitura para qualquer agente. Ele deve ser lido depois de `AGENTS.md` e antes de `PROJECT_STATE.md`.

## Interface humana por blocos

O proprietário pode operar a memória do projeto com comandos simples:

- `Liste os blocos ativos do VETTA.`
- `Leia o bloco X e siga-o.`

Quando um bloco do Notion for citado, o agente deve tratá-lo como **roteador operacional**: localizar sozinho Central Oficial, Estado Oficial, Roadmap, decisões, aprendizados, códigos `N-xxx`, branch-alvo, fotografia, PR, CI, ambiente e regras técnicas relacionadas. O proprietário não deve ser obrigado a enumerar essas dependências.

O bloco não substitui a verdade técnica viva. Depois de resolver o contexto do Notion, o agente deve confirmar o estado atual no GitHub e nas demais fontes aplicáveis.

## Sequência obrigatória

1. bloco do Notion citado pelo proprietário, quando houver;
2. `AGENTS.md` — autoridade, escopo, fontes de verdade e forma de trabalhar;
3. `SKILLS.md` — este índice;
4. `TESTING_RULES.md` — responsabilidade autônoma por testes e CI Universal Adaptativa;
5. skill ou regra especializada aplicável;
6. `LEARNING_RULES.md` quando houver defeito, quase falha ou aprendizado;
7. `PROJECT_STATE.md` — estado atual da branch;
8. fontes vivas relevantes.

## Arquivos operacionais

| Área | Arquivo | Aplicação |
|---|---|---|
| UX de produto e fluxos mobile | `.skills/vetta-product-ux/SKILL.md` | obrigatória em diagnóstico, proposta, revisão ou mudança de experiência |
| Testes e CI | `TESTING_RULES.md` | `.github/workflows/ci-engine.yml`, `ci/branch-policy.json`, `scripts/ci/` |
| PWA, instalação, cache e acesso | `PWA_RULES.md` | testes PWA, Playwright e ambiente publicado |
| Aprendizado técnico | `LEARNING_RULES.md` | `docs/incidents/` |
| Operação prática dos testes | `tests/README.md` | testes descobertos na própria branch |
| Estado vivo | `PROJECT_STATE.md` | branch, commit, CI, deploy e validação física |
| Memória operacional | Notion — Central/Blocos/Decisões/Aprendizados | missão, contexto, autorizações, decisões e aprendizados; nunca substitui GitHub vivo |

## Regra de consistência entre branches

`AGENTS.md`, `SKILLS.md`, `TESTING_RULES.md`, `PWA_RULES.md`, `LEARNING_RULES.md` e `.skills/vetta-product-ux/SKILL.md` são canônicos na `main` e devem permanecer iguais nas branches operacionais.

`PROJECT_STATE.md`, planos, incidentes e `ci/branch-policy.json` refletem o estado específico de cada branch.

## Responsabilidade do agente

Dentro de um bloco autorizado, o agente decide e executa os testes necessários conforme risco e evidência. UX deve ser analisada pela tarefa real, fluxo completo, estados, segurança dos dados, clareza dos números e validação mobile.

O agente também é responsável por resolver as referências internas de um bloco autodirecionável. Códigos, SHAs, arquivos, links de CI e dependências técnicas são memória de máquina; não devem ser transferidos ao proprietário como pré-requisito para continuar o trabalho.

## Criação e uso de branches

Não criar branch nova quando a branch atual comportar o trabalho com segurança.

Criar uma nova branch exige sempre autorização explícita do proprietário. Antes de recomendar uma branch, o agente deve reavaliar se há impedimento real, considerar alternativas e explicar o custo de fragmentar conhecimento. Pressa, conveniência, existência de outro agente ou preferência por isolamento não são justificativas suficientes.

Antes da primeira alteração funcional numa branch realmente autorizada e necessária, confirme governança, estado específico, política da CI e fotografia de origem.

Branches temporárias ou históricas que receberam arquivos canônicos continuam temporárias ou históricas; a presença da skill não autoriza reutilização.

## Fechamento

Todo bloco técnico termina com estado atualizado, evidência fresca e uma das situações de aprendizado previstas em `LEARNING_RULES.md`.

Toda alteração no GitHub deve ser traduzida ao proprietário em linguagem simples: onde mudou, por quê, efeito prático, o que ficou intocado, fotografia salva, testes/CI, publicação e pendências.

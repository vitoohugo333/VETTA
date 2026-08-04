<!-- VETTA_GOVERNANCE_VERSION: 2026-08-03.2 -->
# VETTA — índice técnico obrigatório

Este arquivo é o mapa de leitura para qualquer agente. Ele deve ser lido depois de `AGENTS.md` e antes de `PROJECT_STATE.md`.

## Sequência obrigatória

1. `AGENTS.md` — autoridade, escopo, fontes de verdade e forma de trabalhar;
2. `SKILLS.md` — este índice;
3. `TESTING_RULES.md` — responsabilidade autônoma por testes e CI Universal Adaptativa;
4. arquivo especializado aplicável, especialmente `PWA_RULES.md`;
5. `LEARNING_RULES.md` quando houver defeito, quase falha ou aprendizado;
6. `PROJECT_STATE.md` — estado atual da branch;
7. fontes vivas relevantes.

## Arquivos operacionais

| Área | Arquivo | Prova executável ou histórica |
|---|---|---|
| Testes e CI | `TESTING_RULES.md` | `.github/workflows/ci-engine.yml`, `ci/branch-policy.json`, `scripts/ci/` |
| PWA, instalação, cache e acesso | `PWA_RULES.md` | testes PWA, Playwright e ambiente publicado |
| Aprendizado técnico | `LEARNING_RULES.md` | `docs/incidents/` |
| Operação prática dos testes | `tests/README.md` | testes descobertos na própria branch |
| Estado vivo | `PROJECT_STATE.md` | branch, commit, CI, deploy e validação física |

## Regra de consistência entre branches

`AGENTS.md`, `SKILLS.md`, `TESTING_RULES.md`, `PWA_RULES.md` e `LEARNING_RULES.md` são canônicos na `main` e devem ser idênticos nas branches ativas.

A CI compara esses arquivos. Divergência não autorizada é falha de governança, porque um agente novo poderia receber instruções diferentes dependendo da branch.

`PROJECT_STATE.md`, planos, incidentes e `ci/branch-policy.json` podem e devem refletir o estado específico de cada branch.

## Responsabilidade do agente

Dentro de um bloco autorizado, o agente decide os testes necessários. Não transfira ao proprietário decisões como “rodar ou não rodar teste”, “qual navegador usar” ou “se deve verificar o ambiente publicado”.

A escolha deve seguir risco e evidência, não conveniência operacional.

## Criação de branch

Antes da primeira alteração funcional numa branch nova, confirme:

- arquivos canônicos presentes e iguais à `main`;
- `PROJECT_STATE.md` específico criado;
- `ci/branch-policy.json` correto;
- `.github/workflows/ci-autonomous.yml` presente;
- CI inicial verde na fotografia de origem.

Sem isso, a branch não está pronta para desenvolvimento.

## Fechamento

Todo bloco técnico termina declarando uma das três situações de aprendizado previstas em `LEARNING_RULES.md` e apresentando evidência fresca dos testes escolhidos.

# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-07, horário de Brasília  
**Estado:** governança canônica operacional; verificador da CI corrigido para acompanhar a governança viva sem exigir uma versão histórica fixa.  
**Papel:** `main` mantém governança, regras canônicas e orquestração; não publica o aplicativo.

## Codex Engineering Guardrails

- plugin primeiro;
- skill direta como fallback;
- `code-verification` para auditoria e diagnóstico;
- `code-work` para mudança autorizada.

## Governança canônica vigente

- `AGENTS.md`: `VETTA_GOVERNANCE_VERSION: 2026-08-07.1`;
- `SKILLS.md`: `VETTA_GOVERNANCE_VERSION: 2026-08-07.2`;
- arquivos canônicos podem ter versões próprias, mas branches operacionais devem manter conteúdo idêntico ao correspondente da `main`;
- criar branch continua exigindo autorização explícita do proprietário.

## Correção da CI em 07/08/2026

A execução `full` da `refatoracao-360-ux` revelou que `scripts/ci/verify-repository.mjs` ainda exigia `VETTA_GOVERNANCE_VERSION: 2026-08-03.2` em todos os arquivos canônicos. Isso bloqueava a CI antes dos testes do aplicativo.

A correção autorizada na `main` foi restrita à governança:

- o verificador exige agora um marcador válido no formato `AAAA-MM-DD.N`;
- ao verificar outra branch, continua exigindo igualdade exata com os arquivos canônicos da `main`;
- não existe mais dependência de uma data histórica fixa.

Fotografia da correção do verificador: `7de5ef4325f856c732af4dacbba08c6495fe2845`.

Prova: execução `full` da `main` `31199195848` concluída com sucesso em classificação, integridade, sintaxe, JSON e testes determinísticos. Navegadores foram corretamente ignorados porque `main` não é a branch do aplicativo.

O aprendizado completo foi registrado em `docs/incidents/2026-08-07-ci-governance-version-drift.md`.

## Branches e ambientes relevantes

| Finalidade | Branch | Ambiente |
|---|---|---|
| Governança canônica | `main` | não publica o app |
| Produção estável/testadores | `netlify/teste-fechado` | Netlify estável |
| Desenvolvimento de UX anterior | `netlify/teste-fechado-ux` | GitHub Pages |
| Experimento Refatoração 360 | `refatoracao-360-ux` | nenhum ambiente publicado próprio confirmado |
| Referência histórica | `migration/vetta-clean-3-5-1` | sem desenvolvimento novo |

Nenhuma branch foi mesclada ou sincronizada nesta correção.

## Impacto

Alterados somente:

- `scripts/ci/verify-repository.mjs`;
- documentação do incidente;
- este estado oficial.

Permaneceram intocados o código funcional do aplicativo, cálculos, dados, armazenamento, interface, PWA, Netlify e GitHub Pages.

## Aprendizado

**Aprendizado fechado:** o verificador deve validar marcador de governança + igualdade com a `main`, nunca uma versão histórica global fixa.

## Próximo passo único

Confirmar este checkpoint final da `main` com a CI de governança e retomar a `refatoracao-360-ux` sem sincronizar ou mesclar branches.

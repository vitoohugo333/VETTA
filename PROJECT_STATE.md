# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-07, horário de Brasília  
**Estado:** governança canônica operacional; verificador da CI corrigido para acompanhar a governança viva sem exigir uma versão histórica fixa. Guardrails agora também é gate operacional contínuo sob N-013.  
**Papel:** `main` mantém governança, regras canônicas e orquestração; não publica o aplicativo.

## Codex Engineering Guardrails

- plugin primeiro;
- skill direta como fallback;
- `code-verification` para auditoria e diagnóstico;
- `code-work` para mudança autorizada;
- N-013 exige Guardrails ativo durante toda a operação, não só no preflight;
- se um agente perceber que começou sem Guardrails, deve ativá-lo no próximo ponto seguro e revisar o trecho já executado antes de continuar.

## Governança canônica vigente

- `AGENTS.md`: `VETTA_GOVERNANCE_VERSION: 2026-08-07.1`;
- `SKILLS.md`: `VETTA_GOVERNANCE_VERSION: 2026-08-07.4`;
- arquivos canônicos podem ter versões próprias, mas branches operacionais devem manter conteúdo idêntico ao correspondente da `main`;
- criar branch continua exigindo autorização explícita do proprietário;
- checkpoints relevantes seguem N-012: GitHub + `PROJECT_STATE.md` + Notion devem permanecer coerentes;
- execução técnica segue N-013: plugin Guardrails primeiro, skill direta como fallback e recuperação obrigatória se trabalho tiver começado sem cobertura confirmada.

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

Neste checkpoint N-013 foram alterados somente governança e documentação:

- `SKILLS.md`;
- este `PROJECT_STATE.md`;
- memória operacional correspondente no Notion.

Permaneceram intocados o código funcional do aplicativo, cálculos, dados, armazenamento, interface, PWA, Netlify e GitHub Pages.

## Aprendizado

- **Aprendizado fechado:** o verificador deve validar marcador de governança + igualdade com a `main`, nunca uma versão histórica global fixa.
- **Aprendizado fechado:** Guardrails não pode ser tratado apenas como preflight; a operação deve recuperar cobertura no próximo ponto seguro se um trecho tiver começado sem ele.

## Próximo passo único

Continuar os trabalhos técnicos normalmente sob N-012 e N-013: Notion sincronizado por checkpoint relevante e Codex Engineering Guardrails ativo durante toda a operação.

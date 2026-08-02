# Estado oficial — VETTA

**Atualizado em:** 2026-08-02
**Estado:** base 3.5.1 restaurada byte a byte na branch de migração; aguardando validação física.
**Alteração em curso:** a árvore funcional de `CALCULA-MOTORA/main` no commit `f4817fb0b8fd753b8d51f077837a65ac6a92d6c6` substitui integralmente a base reduzida na branch remota `migration/vetta-clean-3-5-1`.
**Validação física:** aguardando validação física.

## Repositório e publicação

| Item | Estado atual |
|---|---|
| Repositório Git | `vitoohugo333/VETTA` |
| Branch de origem | `CALCULA-MOTORA/main` em `f4817fb0b8fd753b8d51f077837a65ac6a92d6c6` |
| Branch de trabalho | `migration/vetta-clean-3-5-1` (remota; PR #1) |
| Base anterior da branch | `dc79f7f57150ac6918dd48d6105d0e6f7fd8523f` |
| Site de validação | ainda não configurado |
| SHA servido | ainda não configurado |
| Produção | ainda não configurada |

## Verdades confirmadas

- A origem aprovada é a `main` 3.5.1 do CALCULA-MOTORA, no commit acima.
- Interface, fluxos, cálculos e PWA foram preservados por cópia de conteúdo, sem redesenho ou reinterpretação.
- Arquivos de governança do VETTA permanecem próprios: `AGENTS.md`, este estado e a verificação de governança.
- A checagem de produção da origem referencia `netlify/edge-functions/access-gate.js`, que não está presente no commit de origem. Isso é uma pendência da própria referência e não foi alterado para manter paridade.

## Branches remotas ativas

| Branch | Papel | Situação |
|---|---|---|
| `main` | fundação protegida | ativa |
| `migration/vetta-clean-3-5-1` | migração byte a byte em PR #1 | ativa |

## Próximo passo único

Validar a interface restaurada no celular antes de qualquer merge ou publicação.

## Registro de evidência

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-02 | Referência de origem confirmada | commit `f4817fb0b8fd753b8d51f077837a65ac6a92d6c6` | aprovada pelo proprietário |
| 2026-08-02 | Paridade da migração | hashes SHA-256 dos arquivos funcionais da origem | aguardando confirmação pós-envio |
| 2026-08-02 | Teste da referência | `node tests/verify-production.mjs` | falha conhecida: arquivo `netlify/edge-functions/access-gate.js` ausente na própria referência |

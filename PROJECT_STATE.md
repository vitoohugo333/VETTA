# Estado oficial — VETTA

**Atualizado em:** 2026-08-02  
**Estado:** migração limpa do aplicativo local-first em revisão remota.
**Alteração em curso:** base inicial do aplicativo reescrita na branch remota `migration/vetta-clean-3-5-1`; aguardando revisão e validação física.
**Validação física:** aguardando validação física.

## Repositório e publicação

| Item | Estado atual |
|---|---|
| Repositório Git | `vitoohugo333/VETTA` |
| Branch de origem | `main` em `67361493784548dc31f063fb5bf76cbd1f247bd4` |
| Branch de trabalho | `migration/vetta-clean-3-5-1` (remota) |
| Commit de fundação | `67361493784548dc31f063fb5bf76cbd1f247bd4` |
| Site de validação | ainda não configurado |
| SHA servido | ainda não configurado |
| Produção | ainda não configurada |

## Verdades confirmadas

- O VETTA começa com esta fundação organizacional.
- A prioridade de produto é: confiança nos cálculos, registro diário, histórico útil e onboarding claro.
- Novas áreas só serão consideradas depois da consolidação da experiência principal.
- A primeira base do aplicativo foi escrita na branch de trabalho, com cálculos puros, dados locais, telas e navegação separados.
- A branch de migração e seu commit de revisão foram enviados; não há PR ou site criado nesta alteração.

## Branches remotas ativas

| Branch | Papel | Situação |
|---|---|---|
| `main` | fundação inicial | ativa |

## Próximo passo único

Revisar a migração limpa remota e autorizar a abertura de PR em rascunho, se estiver de acordo.

## Itens deliberadamente adiados

- Modularização ampla ou sistema de plugins.
- Backend, login, sincronização, pagamentos, PDF e CSV.
- Refino visual ou novos recursos.

## Registro de evidência

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-02 | Fundação publicada na `main` | sete arquivos operacionais conferidos no GitHub | aprovada: estrutura presente |
| 2026-08-02 | Governança inicial revisada | `scripts/verify-governance.sh` | aprovado: checagem documental passou |
| 2026-08-02 | Protocolo de integridade publicado | leitura direta do GitHub dos três arquivos e oito requisitos obrigatórios | aprovado: requisitos presentes |
| 2026-08-02 | Migração limpa enviada | branch remota e sete testes determinísticos | aguardando revisão e validação física |

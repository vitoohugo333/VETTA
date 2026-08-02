# Estado oficial — VETTA

**Atualizado em:** 2026-08-02
**Estado:** versão candidata validada no celular pelo proprietário; o checkpoint da PR #1 está atualizado e `main` permanece intocada.
**Alteração em curso:** confirmar a CI da correção documental antes de decidir se a PR deve sair de rascunho ou ser integrada.
**Validação física:** aprovada pelo proprietário em 2026-08-02, no site de validação abaixo.

## Repositório e publicação

| Item | Estado atual |
|---|---|
| Repositório Git | `vitoohugo333/VETTA` |
| Branch de origem | `CALCULA-MOTORA/main` em `f4817fb0b8fd753b8d51f077837a65ac6a92d6c6` |
| Branch de trabalho | `migration/vetta-clean-3-5-1` (PR #1 em rascunho) |
| Base do app validada | `aa58e4d5257713d7db5ceb7570f016cc2ffdc966` — inclui a proteção de acesso do Netlify |
| Atualizações posteriores da PR | regras de trabalho e checkpoint documental; não alteram o app, cálculos, dados, interface, PWA ou publicação |
| Site de validação | `https://vitoohugo333.github.io/VETTA/` |
| Conteúdo servido | confirmado em 2026-08-02: `index.html`, `app.js`, `styles.css`, `sw.js` e `manifest.webmanifest` são idênticos à base validada `aa58e4d` |
| Configuração do Pages | a origem configurada (branch e pasta) não foi confirmada por API nesta checagem; a correspondência direta do conteúdo com a branch foi confirmada |
| Produção | `main` permanece em `67361493784548dc31f063fb5bf76cbd1f247bd4`; não recebeu a versão validada |

## Verdades confirmadas

- A origem aprovada foi a `main` 3.5.1 do CALCULA-MOTORA, na fotografia indicada acima.
- O proprietário validou no celular a interface e o funcionamento da versão exposta no site de validação.
- A checagem de 2026-08-02 comparou cinco arquivos públicos do site com a fotografia atual da branch e confirmou igualdade de conteúdo.
- A base validada inclui a proteção de acesso do Netlify; isso não muda o conteúdo que foi validado no GitHub Pages.
- A atualização de regras alterou apenas `AGENTS.md`. A checagem de produção passou; a falha documental foi causada por referências antigas no script e foi corrigida nesta PR.
- Arquivos de governança do VETTA permanecem próprios: `AGENTS.md`, este estado e a verificação de governança.

## Branches remotas ativas

| Branch | Papel | Situação |
|---|---|---|
| `main` | fundação protegida | ativa |
| `migration/vetta-clean-3-5-1` | migração byte a byte em PR #1 | ativa |

## Próximo passo único

Confirmar a CI da correção documental antes de decidir se a PR #1 sai de rascunho.

## Registro de evidência

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-02 | Referência de origem confirmada | commit `f4817fb0b8fd753b8d51f077837a65ac6a92d6c6` | aprovada pelo proprietário |
| 2026-08-02 | Site de validação | hashes SHA-256 de `index.html`, `app.js`, `styles.css`, `sw.js` e `manifest.webmanifest` comparados à fotografia `aa58e4d` | conteúdos idênticos |
| 2026-08-02 | Validação física | confirmação explícita do proprietário no celular | aprovada |
| 2026-08-02 | CI da fotografia atual | GitHub Actions: Governança (execução 10) e Verify VETTA Production (execução 3) | ambas aprovadas |
| 2026-08-02 | CI da atualização documental `2ba6acad` | GitHub Actions: Verify VETTA Production (execução 4) | aprovada; Governança falhou por referências antigas no script e será corrigida nesta atualização |

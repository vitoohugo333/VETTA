# Estado oficial — VETTA

**Atualizado em:** 2026-08-03
**Estado:** o bloqueio de uso fora do PWA foi implementado na branch do Bloco 1; aguardando CI e validação física no celular.
**Alteração em curso:** gate obrigatório de instalação do PWA sobre a branch do Bloco 1, sem alteração de cálculos, dados, `main` ou Netlify.
**Validação física:** a base anterior foi aprovada pelo proprietário em 2026-08-02; o novo gate ainda aguarda teste no celular.

## Repositório e publicação

| Item | Estado atual |
|---|---|
| Repositório Git | `vitoohugo333/VETTA` |
| Branch de origem | `CALCULA-MOTORA/main` em `f4817fb0b8fd753b8d51f077837a65ac6a92d6c6` |
| Branch de trabalho atual | `feature/bloco-1-navegacao-secundaria` |
| Base do app validada | `aa58e4d5257713d7db5ceb7570f016cc2ffdc966` — inclui a proteção de acesso do Netlify |
| Bloco 1 anterior | `7ab1464063c22b0f74c9600364ffabd275c8523a` |
| Gate obrigatório do PWA | implementação principal em `99e729554c77c5588a8c9e20a4897338202a18c2`; regra operacional do Pages em `8427e05da5e4da4e5a6d717682066a25ccf3c3b1` |
| Site de validação | `https://vitoohugo333.github.io/VETTA/` |
| Atualização do Pages | a branch configurada alimenta o site automaticamente; o conteúdo servido após esta mudança ainda não foi confirmado |
| Produção | `main` permanece fora deste bloco; não foi alterada |

## Verdades confirmadas agora

- O navegador comum recebe uma página própria de instalação e não carrega `app.js` nem a interface financeira.
- O aplicativo atual foi preservado integralmente em `app-shell.html` e é aberto somente em modo instalado/standalone.
- Android usa o evento nativo de instalação quando disponível; iPhone recebe instruções de Safari, Compartilhar e Adicionar à Tela de Início.
- Após `appinstalled`, a página orienta abrir pelo ícone do VETTA; não existe promessa de botão capaz de abrir automaticamente o PWA instalado.
- O service worker passou a armazenar também `app-shell.html` e usa um novo nome de cache.
- Cálculos, armazenamento local, histórico, onboarding e navegação do Bloco 1 não foram editados.
- O `AGENTS.md` registra que atualizar a branch configurada no GitHub Pages atualiza automaticamente o site, mantendo a conferência final como prova.

## Branches remotas ativas

| Branch | Papel | Situação |
|---|---|---|
| `main` | fundação protegida | ativa e intocada neste bloco |
| `migration/vetta-clean-3-5-1` | migração byte a byte em PR #1 | ativa |
| `feature/bloco-1-navegacao-secundaria` | Bloco 1 e gate obrigatório do PWA | atualizada; aguardando CI e validação física |
| `tmp/pwa-gate-apply` | branch temporária criada durante tentativa de aplicação | sem mudança funcional; precisa ser removida |
| `tmp/pwa-gate-apply-2` | branch temporária criada durante tentativa de aplicação | sem mudança funcional; precisa ser removida |

**Divergência:** existem cinco branches remotas, acima do limite de quatro. As duas branches `tmp/` foram criadas por engano durante a operação e não alimentam o site. A ferramenta disponível nesta sessão não oferece exclusão de branch; a limpeza permanece pendente e não deve ser ocultada.

## Próximo passo único

Validar no celular que o navegador mostra somente a instalação e que o VETTA aberto pelo ícone carrega normalmente, preservando dados e navegação.

## Registro de evidência

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-02 | Referência de origem confirmada | commit `f4817fb0b8fd753b8d51f077837a65ac6a92d6c6` | aprovada pelo proprietário |
| 2026-08-02 | Site de validação anterior | hashes SHA-256 de `index.html`, `app.js`, `styles.css`, `sw.js` e `manifest.webmanifest` comparados à fotografia `aa58e4d` | conteúdos idênticos naquele momento |
| 2026-08-02 | Validação física da base anterior | confirmação explícita do proprietário no celular | aprovada |
| 2026-08-03 | Bloco 1 enviado ao GitHub | commit `7ab1464063c22b0f74c9600364ffabd275c8523a` | aguardava CI e validação física |
| 2026-08-03 | Gate obrigatório do PWA | `index.html`, `app-shell.html`, `sw.js` e teste focado no commit `99e729554c77c5588a8c9e20a4897338202a18c2` | implementação gravada; CI ainda não confirmada |
| 2026-08-03 | Regra automática do GitHub Pages | `AGENTS.md` no commit `8427e05da5e4da4e5a6d717682066a25ccf3c3b1` | regra registrada |

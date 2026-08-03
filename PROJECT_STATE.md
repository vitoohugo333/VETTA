# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03
**Estado:** barreira de acesso corrigida para não bloquear os arquivos técnicos do PWA; aguardando validação física no Android.
**Alteração em curso:** validação real do botão de instalação na branch `netlify/teste-fechado`.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch de validação | `netlify/teste-fechado` |
| Fotografia funcional do PWA | `d20128067a5c9a671508cd75a1bed6027129aeae` |
| Site de validação | `https://calculaae.netlify.app/` |
| Deploy funcional do Netlify | `6a7107f5df02270008e97bd5`, pronto e ligado à fotografia funcional |
| Plano de produto ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
| `main` | não alterada |

## Confirmado agora

- A barreira continua aplicada ao restante do site por `path = "/*"`.
- `manifest.webmanifest`, `sw.js`, `icon.svg`, `icon-192.png` e `icon-512.png` foram excluídos da Edge Function de acesso por `excludedPath`.
- A interface, os cálculos, os dados financeiros, a navegação, o manifesto, o service worker e os ícones não foram modificados neste bloco.
- O teste `tests/pwa-access-boundary.test.mjs` foi criado e passou na preparação isolada.
- `tests/verify-production.mjs` foi alinhado ao fluxo de instalação atual.
- `AGENTS.md` agora define o GitHub remoto como espaço principal de trabalho e inclui commit, sincronização e deploy automático da branch no mesmo bloco autorizado.
- `SKILLS.md` foi criado como índice técnico obrigatório.
- `PWA_RULES.md` registra permanentemente que uma barreira global não pode bloquear os arquivos técnicos do PWA.
- O deploy Netlify `6a7107f5df02270008e97bd5` terminou pronto e está ligado ao commit funcional `d20128067a5c9a671508cd75a1bed6027129aeae`.
- `docs/planos/README.md` passou a ser o índice dos planos atuais.
- O documento anterior `docs/PLANO-DE-APLICACAO.md` foi classificado como histórico pelo novo índice; seu conteúdo foi preservado.
- `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` é o único plano marcado como ativo.
- Contas, pagamentos, Stripe, webhooks, sincronização e expansões ficaram fora do plano ativo.

## Evidência técnica

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-03 | Regra de trabalho remoto | commits `c127a20c6cde8f48e1f7f86c11e6717b23fe1ccb` e `2e0042b6a3dd7a2039843dea52038a5429a78848` | autorização do bloco inclui sincronização remota e deploy automático conhecido |
| 2026-08-03 | Regra permanente do PWA | commit `f5fed45d20a3dff68228a6e53e0beed88480e51f` | causa, prevenção e prova registradas em `PWA_RULES.md` |
| 2026-08-03 | Contrato de regressão | commits `787d2c286ed18f8cba48dd1e624acd5a80e9d593`, `039729250898c8017f6297dc2fd79afa4bf93e0f` e `48d354d4dec1edbb303d64bae637ab4eb6ff74d6` | teste dedicado incluído no fluxo de verificação |
| 2026-08-03 | Correção da barreira | commit `d20128067a5c9a671508cd75a1bed6027129aeae` | cinco arquivos técnicos excluídos da Edge Function |
| 2026-08-03 | Publicação automática | deploy Netlify `6a7107f5df02270008e97bd5` | pronto e ligado ao commit funcional |
| 2026-08-03 | Índice dos novos planos | commit `5b3d9d07dcfa3f1aa79d25207c9f1d8b60dcca95` | plano anterior classificado como histórico e etapas futuras separadas |
| 2026-08-03 | Plano ativo da experiência | commit `6ab43efecb01d7fbc403f1a2afeae488eaa86b47` | escopo atual organizado em blocos de consolidação da experiência |

## Ainda não confirmado

- Resposta HTTP direta dos cinco arquivos do PWA no aparelho do proprietário.
- Se, com o aplicativo realmente desinstalado, o Chrome libera `beforeinstallprompt` e o botão abre a janela nativa.
- Reconhecimento de uma instalação antiga pelo Chrome do aparelho.
- Fluxo completo no iPhone/Safari.
- Não há execução de CI associada a esta branch; a evidência automatizada disponível no bloco do PWA foi o teste isolado e o build do Netlify.
- Nenhum bloco de interface do novo Plano 01 foi implementado ou validado no celular.

## Próximo passo único

Concluir a validação física do PWA já em curso; depois iniciar o Bloco 0 do Plano 01, sem alterar ainda a interface.

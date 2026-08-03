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

## Evidência técnica

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-03 | Regra de trabalho remoto | commits `c127a20c6cde8f48e1f7f86c11e6717b23fe1ccb` e `2e0042b6a3dd7a2039843dea52038a5429a78848` | autorização do bloco inclui sincronização remota e deploy automático conhecido |
| 2026-08-03 | Regra permanente do PWA | commit `f5fed45d20a3dff68228a6e53e0beed88480e51f` | causa, prevenção e prova registradas em `PWA_RULES.md` |
| 2026-08-03 | Contrato de regressão | commits `787d2c286ed18f8cba48dd1e624acd5a80e9d593`, `039729250898c8017f6297dc2fd79afa4bf93e0f` e `48d354d4dec1edbb303d64bae637ab4eb6ff74d6` | teste dedicado incluído no fluxo de verificação |
| 2026-08-03 | Correção da barreira | commit `d20128067a5c9a671508cd75a1bed6027129aeae` | cinco arquivos técnicos excluídos da Edge Function |
| 2026-08-03 | Publicação automática | deploy Netlify `6a7107f5df02270008e97bd5` | pronto e ligado ao commit funcional |

## Ainda não confirmado

- Resposta HTTP direta dos cinco arquivos no aparelho do proprietário.
- Se, com o aplicativo realmente desinstalado, o Chrome libera `beforeinstallprompt` e o botão abre a janela nativa.
- Reconhecimento de uma instalação antiga pelo Chrome do aparelho.
- Fluxo completo no iPhone/Safari.
- Não há execução de CI associada a esta branch; a evidência automatizada disponível neste bloco foi o teste isolado e o build do Netlify.

## Próximo passo único

No Android, desinstalar o CalculaAê, abrir `https://calculaae.netlify.app/` no Chrome, entrar com a senha e tocar em `Instalar CalculaAê`; informar se a janela nativa de instalação apareceu.

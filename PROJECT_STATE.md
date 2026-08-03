# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03
**Estado:** tela de instalação aprovada restaurada e lógica Android corrigida; aguardando validação física.
**Alteração em curso:** validação da detecção real de PWA instalado na branch `netlify/teste-fechado`.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch de validação | `netlify/teste-fechado` |
| Fotografia funcional publicada | `d92a663f9adc29f58f2774d613d98914b8a91f8c` |
| Site de validação | `https://calculaae.netlify.app/` |
| Deploy do Netlify | pronto e ligado à fotografia funcional |
| `main` | não alterada |

## Confirmado agora

- A aparência e os textos da tela foram restaurados a partir da fotografia aprovada `1e779207103ea20d6aceddfa8902841d6d370d66`.
- A versão genérica posterior foi removida.
- `localStorage` deixou de ser a fonte principal para dizer se o PWA está instalado.
- No Android, a página agora consulta `navigator.getInstalledRelatedApps()` quando disponível.
- O manifesto declara o próprio PWA em `related_applications` sem trocar seu `id`.
- O evento `beforeinstallprompt` continua sendo usado somente quando o Chrome realmente libera o instalador.
- Se nenhuma prova chegar, a espera termina e o botão vira `Verificar novamente`, sem recarregamento em loop.
- O cache do service worker foi renovado para `calculaae-install-flow-4`.
- Cálculos, dados financeiros, login, navegação interna, `app-shell.html` e `main` não foram alterados.

## Evidência técnica

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-03 | Autorrelação do PWA no manifesto | commit `80e6903cc2c17ae2e47782df17031faeea6a5b3d` | manifesto preparado para consultar instalação no Chrome Android |
| 2026-08-03 | Restauração visual e nova lógica | commit `b073335269daef25f8f5fa34a0f6400efbe97375` | tela aprovada restaurada e memória local removida da decisão principal |
| 2026-08-03 | Renovação do cache | commit `d92a663f9adc29f58f2774d613d98914b8a91f8c` | novos arquivos de instalação publicados pelo service worker |
| 2026-08-03 | Publicação automática | deploy Netlify `6a7101ea63c8d2000843df3f` | pronto e ligado a `d92a663f9adc29f58f2774d613d98914b8a91f8c` |

## Ainda não confirmado

- Se o Chrome do aparelho do proprietário reconhece imediatamente uma instalação antiga do mesmo PWA pela nova autorrelação.
- Se, com o aplicativo realmente desinstalado, o Chrome libera `beforeinstallprompt` e o botão `Instalar CalculaAê`.
- Fluxo completo no iPhone/Safari.

## Próximo passo único

Validar no Android os dois estados reais: aplicativo já instalado e aplicativo desinstalado.

# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03
**Estado:** nova experiência de instalação publicada; aguardando validação física no celular.
**Alteração em curso:** finalização da página inicial de instalação na branch `netlify/teste-fechado`.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch de validação | `netlify/teste-fechado` |
| Fotografia publicada | `92bb7f72efed042eea50b7937bc84376461165ff` |
| Site de validação | `https://calculaae.netlify.app/` |
| Deploy do Netlify | pronto e ligado à fotografia publicada |
| `main` | não alterada |

## Confirmado agora

- A página de instalação foi redesenhada com hierarquia visual maior.
- Android agora possui estados de preparação, instalação disponível, abertura do instalador, cancelamento e conclusão.
- O botão de instalação só é ativado depois que o Android libera o instalador nativo.
- iPhone possui passos próprios e botão `Já adicionei` para abrir o estado de conclusão.
- O estado concluído mostra `CalculaAê instalado!` em destaque e orienta abrir pelo ícone.
- O navegador registra a confirmação local e permite voltar ao fluxo por `Ainda não encontrei o ícone`.
- O cache do service worker foi renovado para reduzir risco de exibição da página anterior.
- Cálculos, dados financeiros, login, navegação interna e `main` não foram alterados.

## Evidência técnica

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-03 | Redesenho do fluxo | commit `1e779207103ea20d6aceddfa8902841d6d370d66` | página e estados implementados |
| 2026-08-03 | Renovação do cache | commit `92bb7f72efed042eea50b7937bc84376461165ff` | cache atualizado |
| 2026-08-03 | Publicação automática | deploy Netlify `6a70f2391929cb0008cd3e7a` | pronto, sem erro de build |

## Ainda não confirmado

- Aparência e funcionamento final no celular Android após esta atualização.
- Fluxo completo no iPhone/Safari.

## Próximo passo único

Validar no celular a nova página, o botão de instalação e o estado visual `CalculaAê instalado!`.

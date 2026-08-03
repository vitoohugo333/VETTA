# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03  
**Estado:** versão estável preservada para testadores; branch UX criada para o Bloco 1.  
**Alteração em curso:** nenhuma no aplicativo; aguardando o proprietário selecionar a branch UX no GitHub Pages.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch estável dos testadores | `netlify/teste-fechado` |
| Site estável dos testadores | `https://calculaae.netlify.app` |
| Branch de desenvolvimento UX | `netlify/teste-fechado-ux` |
| Origem da branch UX | fotografia `c1cca4cd573004b332fb04a2c57c992b2ce8364a` da branch estável |
| Ambiente UX | GitHub Pages, ainda aguardando seleção manual da branch pelo proprietário |
| Plano de separação | `docs/planos/01-AMBIENTES-TESTE-E-UX.md` |
| Plano de produto ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
| Branch histórica permanente | `migration/vetta-clean-3-5-1` |
| `main` | protegida e não alterada; `2a42c39612ec161bf58f16bbbbbd26521f28d30a` |

## Decisões explícitas do proprietário

- Os testadores continuam usando a versão estável no Netlify.
- A reorganização da interface será desenvolvida somente em `netlify/teste-fechado-ux`.
- O proprietário selecionará manualmente essa branch como fonte do GitHub Pages.
- `migration/vetta-clean-3-5-1` é uma referência histórica permanente e nunca deve ser excluída.
- As branches antigas restantes serão ignoradas por enquanto.
- Não será criada outra credencial de acesso neste momento.
- `main`, cálculos, dados, PWA e acesso continuam protegidos.

## Separação dos ambientes

| Ambiente | Branch | Uso | Situação |
|---|---|---|---|
| Netlify estável | `netlify/teste-fechado` | testadores externos | deve permanecer sem o Bloco 1 |
| GitHub Pages UX | `netlify/teste-fechado-ux` | validação manual do proprietário | branch criada; publicação ainda não confirmada |
| Produção | `main` | produção protegida | intocada |
| Referência | `migration/vetta-clean-3-5-1` | histórico estável | protegida permanentemente |

## Evidência da criação da branch UX

- A ponta confirmada da branch estável antes da criação era `c1cca4cd573004b332fb04a2c57c992b2ce8364a`.
- `netlify/teste-fechado-ux` foi criada exatamente a partir dessa fotografia.
- Na criação, o aplicativo das duas branches era idêntico.
- O primeiro commit exclusivo da branch UX criou apenas `docs/planos/01-AMBIENTES-TESTE-E-UX.md`.
- Nenhum arquivo funcional do aplicativo foi alterado.

## Aplicativo e validação física

- A instalação e a abertura do PWA permanecem validadas no Android na versão estável.
- Nenhuma tela, cálculo, dado, manifesto, service worker, cache ou credencial foi alterado neste bloco.
- Não é necessária nova validação física até existir mudança de interface no Bloco 1.
- O fluxo completo no iPhone/Safari continua não confirmado.

## GitHub Pages — pendente

A configuração exata do GitHub Pages ainda não está confirmada pelo conector. O proprietário fará a seleção manual da branch `netlify/teste-fechado-ux` e da pasta aplicável.

Depois dessa seleção, confirmar obrigatoriamente:

1. URL do GitHub Pages;
2. branch e pasta configuradas;
3. fotografia atual da branch UX;
4. conteúdo efetivamente servido;
5. Netlify ainda servindo a branch estável.

## Branches e PR

As branches antigas permanecem no repositório e serão ignoradas por enquanto. Nenhuma foi excluída neste bloco.

A PR #1 continua aberta em rascunho, sem merge, com base em `main` e cabeça em `migration/vetta-clean-3-5-1`.

## Aprendizado do bloco

**Nenhum aprendizado permanente novo.**

Foi aplicada a regra já conhecida de separar uma versão estável em teste de uma mudança visual de maior risco.

## Próximo passo único — ativar o ambiente UX no GitHub Pages

O proprietário deve abrir as configurações do GitHub Pages e selecionar `netlify/teste-fechado-ux` como branch de publicação, usando a mesma pasta atualmente adequada ao projeto.

Essa ação somente aponta o GitHub Pages para a branch UX. Ela ainda não autoriza implementar o Bloco 1.

Depois que o proprietário informar que selecionou a branch, o agente deverá confirmar a URL, o conteúdo servido e a separação real do Netlify antes de apresentar ou executar o contrato do Bloco 1.

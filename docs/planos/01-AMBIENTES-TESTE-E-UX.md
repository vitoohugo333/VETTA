# Plano 01 — separação entre testes estáveis e desenvolvimento UX

**Decisão do proprietário:** 2026-08-03  
**Estado:** ativo para o Bloco 1

## Objetivo

Preservar a versão estável já entregue aos testadores enquanto a reorganização de interface do Bloco 1 é desenvolvida e validada separadamente pelo proprietário.

## Ambientes

| Uso | Branch | Ambiente | Regra |
|---|---|---|---|
| Testadores externos | `netlify/teste-fechado` | `https://calculaae.netlify.app` | permanecer estável; não receber o Bloco 1 |
| Desenvolvimento UX | `netlify/teste-fechado-ux` | GitHub Pages, após seleção manual pelo proprietário | receber somente o trabalho autorizado do Plano 01 |
| Produção protegida | `main` | produção | não alterar sem autorização separada |
| Referência histórica | `migration/vetta-clean-3-5-1` | GitHub | nunca excluir, renomear ou mover |

## Origem da branch UX

A branch `netlify/teste-fechado-ux` foi criada a partir da fotografia `c1cca4cd573004b332fb04a2c57c992b2ce8364a` da `netlify/teste-fechado`.

Na criação, ambas continham exatamente o mesmo aplicativo. As mudanças documentais posteriores desta branch não alteram interface, cálculos, dados, PWA ou acesso.

## Fluxo de trabalho

1. O Bloco 1 é implementado somente em `netlify/teste-fechado-ux`.
2. O proprietário seleciona manualmente essa branch como fonte do GitHub Pages.
3. Cada alteração de interface é verificada automaticamente quando possível e validada pelo proprietário no celular.
4. A versão do Netlify continua servindo os testadores sem receber essas mudanças.
5. Nenhuma mudança retorna à branch estável, à `main` ou à produção sem autorização específica posterior.

## O que esta separação não autoriza

- implementar o Bloco 1 antes do contrato específico;
- alterar fórmulas financeiras ou dados salvos;
- modificar instalação, manifesto, service worker, cache ou barreira de acesso;
- mudar a configuração do Netlify;
- alterar `main`;
- fazer merge, tag, release ou publicação de produção;
- excluir branches antigas.

## Prova necessária antes do Bloco 1

Após o proprietário selecionar a branch no GitHub Pages, confirmar:

1. URL efetiva;
2. branch e pasta configuradas;
3. fotografia atual da branch UX;
4. conteúdo servido correspondente à fotografia esperada;
5. Netlify ainda ligado à branch estável.

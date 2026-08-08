# Incidente — contrato PWA ficou atrás da geração de cache

**Data:** 2026-08-08  
**Branch:** `refatoracao-360-ux`  
**Estado:** aprendizado fechado

## 1. Sintoma

O gate `full` da CI falhou na etapa determinística apesar de a sintaxe e os contratos da nova UX terem passado.

## 2. Causa imediata

`sw.js` elevou corretamente o cache ativo de `vetta-premium-ui-1` para `vetta-premium-ui-2` ao adicionar `ui/interaction.js` e `ui/friendly.css`, mas `tests/pwa-standalone-launch.test.mjs` ainda exigia literalmente a geração anterior.

## 3. Causa estrutural

O nome da geração de cache fazia parte de um contrato estático e, por isso, qualquer mudança material no conjunto offline precisa atualizar no mesmo bloco: Service Worker, lista de assets e teste de lançamento standalone.

## 4. Falha de detecção

A mudança de cache foi coberta pelo novo contrato premium, mas o contrato PWA especializado não foi atualizado no mesmo commit da primeira alteração do Service Worker.

## 5. Correção

O contrato PWA passou a exigir `vetta-premium-ui-2`, `ui/interaction.js` e `ui/friendly.css` na fotografia offline ativa.

## 6. Prevenção permanente

Toda mudança futura no conjunto de assets que formam a autoridade ativa do PWA deve revisar em conjunto:

1. geração de cache em `sw.js`;
2. `APP_SHELL` do Service Worker;
3. `ci/branch-policy.json` quando o arquivo fizer parte da prova servida;
4. contratos PWA que validam a fotografia offline.

## 7. Prova

A execução `full` intermediária `31268682720` mostrou todos os arquivos JavaScript passando em `node --check` e os contratos anteriores passando até chegar especificamente à asserção antiga de cache em `tests/pwa-standalone-launch.test.mjs`.

A prevenção executável ficou no próprio teste atualizado. A fotografia definitiva ainda deve receber gate `full` antes de fechamento operacional.

## 8. Alcance

Aplica-se a qualquer evolução futura de UI, PWA ou assets offline do VETTA. Não altera cálculos, dados ou comportamento financeiro.

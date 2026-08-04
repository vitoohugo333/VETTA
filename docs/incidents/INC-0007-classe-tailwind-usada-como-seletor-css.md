# INC-0007 — Classe Tailwind usada como seletor CSS

**Estado:** aprendizado fechado  
**Data:** 2026-08-04  
**Branch:** `netlify/teste-fechado-ux`  
**Alcance:** módulos de interface e testes de navegador

## Sintoma

A primeira implementação do Bloco 2 não chegava ao estado observável `data-block2="ready"`. Chromium, Firefox, WebKit e o teste do GitHub Pages interrompiam antes de validar o formulário.

## Causa imediata

O módulo tentou localizar o cartão superior com:

```js
querySelector(':scope > .rounded-[2rem]')
```

`rounded-[2rem]` é uma classe gerada pelo Tailwind. Os colchetes possuem significado especial em um seletor CSS e precisariam ser escapados. Usar essa classe diretamente fez o navegador rejeitar o seletor.

## Segunda falha de detecção

A primeira correção procurou um título inventado, `Registro do dia`. O texto real confirmado no HTML remoto era `Como foi seu dia?`. O módulo deixou de quebrar o seletor, mas ainda recusava aplicar o bloco por não reconhecer a tela verdadeira.

## Causa estrutural

A seleção foi criada sem confirmar integralmente a estrutura viva do `app-shell.html`. Uma classe visual frágil e um texto presumido foram usados no lugar da estrutura real da tela.

## Correção

O módulo passou a:

1. localizar o primeiro cartão da própria tela com `root.firstElementChild`;
2. confirmar que o título real continua sendo `Como foi seu dia?`;
3. preservar o formulário original e não aplicar o bloco quando a estrutura esperada não existe.

Nenhuma fórmula, dado financeiro, chave de armazenamento ou arquivo do PWA foi alterado por essa correção.

## Falha separada do teste

O teste de edição pelo Histórico inseria um registro e recarregava a página dentro da mesma avaliação do navegador. O script inicial do teste rodava novamente e restaurava o estado vazio, apagando o dado preparado para o cenário.

A correção foi iniciar a página diretamente com o registro esperado e aguardar o botão de edição ficar visível. O aplicativo não foi alterado para satisfazer esse erro do teste.

## Prevenção permanente

Módulos que reorganizam uma interface devem:

1. conferir o HTML vivo antes de criar seletores;
2. preferir identificadores ou relações estruturais estáveis;
3. não usar diretamente classes Tailwind com colchetes em `querySelector`;
4. validar um sinal real da tela antes de mover elementos;
5. manter retorno seguro quando o contrato do DOM não é atendido;
6. preparar o estado de testes antes da navegação inicial, evitando recargas que reexecutam scripts de inicialização.

A prevenção executável está em:

- `tests/record-block-2-contract.test.mjs`;
- `tests/e2e/record-block-2.spec.js`.

## Evidência

Execuções que identificaram os problemas:

- `30916857730`: seletor CSS inválido;
- `30917401830`: título presumido diferente do HTML real;
- `30918000361`: preparação incorreta do estado no teste de edição.

Execução aprovada:

- `30918538960`, sobre a fotografia funcional `25441d5c44bbf0673ba7f7082cfc29203b29b923`.

Ela concluiu com sucesso testes determinísticos, Chromium, Firefox, WebKit e prova do ambiente publicado.

## Resultado

**Aprendizado fechado:** classes visuais geradas e textos presumidos não substituem a confirmação do DOM real. O Bloco 2 passou a depender de estrutura verificada, com retorno seguro e teste permanente contra regressão.

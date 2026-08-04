# INC-0006 — `hidden` sobrescrito na navegação final

**Estado:** aprendizado fechado  
**Data:** 2026-08-04  
**Branch:** `netlify/teste-fechado-ux`  
**Alcance:** navegação inferior, CSS e testes de PWA

## Sintoma

Na primeira implementação do Bloco 1D, o botão `Dia` recebeu o atributo HTML `hidden`, mas continuou aparecendo na barra inferior. A navegação mostrava cinco itens em vez dos quatro contratados.

Em execuções posteriores, testes do WebKit e do GitHub Pages também falharam ao ler os quatro nomes da barra durante uma recarga normal do PWA.

## Causa imediata

A regra visual existente da barra definia como seus itens deveriam ser exibidos e venceu o comportamento padrão do atributo `hidden`.

Nos testes, `allTextContents()` fazia uma leitura única. Quando o service worker provocava a troca de página exatamente naquele instante, a leitura perdia o contexto do navegador.

## Causa estrutural

O contrato do Bloco 1D exigia que `Dia` deixasse de ser uma área principal, mas a primeira implementação tratou isso como ocultação visual. Para uma barra estrutural com quatro áreas, o teste correto é contar quatro botões reais, mantendo separadamente a tela e o botão `Registrar meu dia`.

## Falha de detecção

A primeira proteção verificava a presença de `hidden`, mas não provava que o CSS final respeitava esse atributo nem que a barra possuía estruturalmente quatro itens.

Os testes de texto também usavam leitura instantânea em vez de uma verificação que aguardasse a estabilização normal do PWA.

## Correção

- somente o botão `Dia` foi retirado da barra depois que todos os destinos foram confirmados;
- a tela `view-day` e o botão `Registrar meu dia` permaneceram no HTML e funcionais;
- o destino foi registrado como `Hoje → Registrar meu dia`;
- os testes passaram a exigir exatamente quatro itens reais na barra;
- leituras dos nomes passaram a usar uma verificação repetida e resistente à recarga do PWA.

## Prevenção permanente

Quando um contrato exigir redução estrutural de navegação:

1. testar a quantidade real de itens interativos, não apenas classes ou atributos visuais;
2. verificar o CSS final antes de confiar em `hidden`;
3. retirar somente o acesso redundante, preservando a tela e o caminho substituto aprovado;
4. executar a mudança apenas depois de confirmar todos os destinos;
5. em testes de PWA, preferir verificações que aguardam o estado esperado a leituras instantâneas do DOM.

Prevenções executáveis:

- `tests/navigation-block-1d-contract.test.mjs`;
- `tests/e2e/navigation-block-1d.spec.js`;
- `tests/e2e-remote/navigation-block-1d-published.spec.js`.

## Prova

A execução `30913206515`, sobre a fotografia `c49862ba473876d08967cb718b957279abd8fd70`, concluiu com sucesso:

- testes determinísticos;
- Chromium;
- Firefox;
- WebKit;
- paridade e interação no GitHub Pages.

## Resultado

**Aprendizado fechado:** uma navegação final deve ser comprovada pela sua estrutura real. A retirada do botão `Dia` não retirou o registro diário; apenas eliminou o acesso redundante da barra depois que o acesso por Hoje estava protegido.

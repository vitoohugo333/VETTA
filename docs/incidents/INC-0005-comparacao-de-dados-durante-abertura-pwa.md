# INC-0005 — Comparação de dados durante a abertura do PWA

**Estado:** aprendizado fechado  
**Data:** 2026-08-04  
**Branch:** `netlify/teste-fechado-ux`  
**Alcance:** testes de navegador e armazenamento local

## Sintoma

A cobertura do Bloco 1C passou no comportamento visual, mas falhou de formas diferentes no Firefox e no WebKit ao comparar o conteúdo bruto do `localStorage` durante a abertura.

## Causa imediata

Dois comportamentos normais acontecem na inicialização:

1. o service worker pode assumir o controle e provocar uma recarga;
2. o aplicativo normaliza o estado salvo, acrescentando metadados internos como `release` e `legacySource`.

O teste interpretava `null` durante a recarga ou a inclusão desses metadados como alteração de dados do usuário.

## Causa estrutural

O teste comparava a serialização bruta do armazenamento em um momento instável, em vez de comparar os dados de negócio depois que o aplicativo estivesse observavelmente pronto.

## Falha de detecção

A primeira versão do teste não separava:

- dados financeiros e de uso;
- metadados internos de migração;
- indisponibilidade momentânea causada pela recarga normal do PWA.

## Correção

O teste passou a:

- esperar a tela e o módulo do bloco ficarem prontos;
- tolerar a recarga normal do PWA;
- remover somente `release` e `legacySource` da comparação;
- comparar integralmente meta, agenda, combustível, custos, registros, eventos e fechamentos.

Nenhum arquivo do aplicativo foi alterado por essa correção.

## Prevenção permanente

Testes que validam preservação de dados durante a abertura de um PWA devem:

1. esperar um estado observável da interface;
2. tolerar troca de contexto causada pelo service worker;
3. comparar dados de negócio separadamente de metadados internos de migração;
4. não tratar normalização compatível como perda ou modificação indevida.

A prevenção executável está em `tests/e2e/today-block-1c.spec.js`.

## Prova

A execução `30907975939`, sobre a fotografia `a73d8807849a903dc1faa442d9eb1afb1a778d99`, concluiu com sucesso:

- testes determinísticos;
- Chromium;
- Firefox;
- WebKit;
- paridade e interação no GitHub Pages.

## Resultado

**Aprendizado fechado:** os dados financeiros permaneceram intactos; as falhas intermediárias pertenciam ao teste e foram eliminadas por uma comparação alinhada ao comportamento real do PWA.

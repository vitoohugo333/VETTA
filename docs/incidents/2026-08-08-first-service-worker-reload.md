# Incidente — primeiro Service Worker recarregava a tarefa aberta

**Data:** 2026-08-08  
**Branch:** `refatoracao-360-ux`  
**Classificação:** PWA / continuidade de navegação

## Sintoma

Na suíte completa da fotografia `dd3e68d938d2c5d7934b86ce18a10a5295429c1d`, Firefox e WebKit perderam a tela ativa durante interações com Plano e Agora. Elementos que existiam passavam a ficar ocultos depois de uma navegação inesperada para `app-shell.html`.

## Causa imediata

O primeiro Service Worker executava `skipWaiting()` e, ao ativar, chamava `clients.claim()`. A página já aberta passava a ser controlada pelo worker e emitia `controllerchange`. O aplicativo interpreta `controllerchange` como atualização real e executa `location.reload()`.

## Causa estrutural

O mesmo mecanismo de tomada de controle era usado tanto na primeira instalação quanto numa atualização. Porém, recarregar é útil apenas quando existe uma versão anterior sendo substituída; na primeira instalação isso interrompe uma tarefa sem benefício.

## Falha de detecção

Os testes PWA anteriores verificavam instalação e abertura, mas não verificavam se a primeira ativação preservava a página já aberta sem recarga.

## Correção

O Service Worker captura, durante a instalação, se já existia um worker ativo anterior. `clients.claim()` passa a ocorrer somente quando há uma atualização real. A primeira instalação ativa o worker sem tomar à força a página em uso.

## Prevenção permanente

`tests/e2e/pwa-gate.spec.js` passa a contar os carregamentos de `app-shell.html` durante a primeira ativação e exige exatamente um carregamento.

## Prova necessária

- teste PWA focado;
- suíte determinística/integridade;
- matriz Chromium, Firefox e WebKit;
- validação física posterior no celular para instalação/atualização real.

## Alcance do aprendizado

A regra vale para futuras mudanças de ciclo de vida do Service Worker: **primeira instalação e atualização são estados diferentes e não devem compartilhar automaticamente a mesma política de recarga da página ativa.**

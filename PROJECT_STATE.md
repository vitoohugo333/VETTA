# Estado oficial — VETTA (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-06, 07:13, horário de Brasília  
**Estado funcional:** Blocos 1A a 5 validados fisicamente; Bloco 6 em correção após falha real na conclusão.  
**Alteração funcional em curso:** garantir que `Montar minha meta` salve, feche o onboarding e abra Hoje.

## Identificação da branch

| Item | Estado atual |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch em uso pelo GitHub Pages | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de UX |
| Site de validação | `https://vitoohugo333.github.io/VETTA/` |
| Fotografia funcional da correção | `c1a0600b920fb70e28e72fa460857919883cd7ca` |
| Fotografia com teste de navegador | `9add29401365cffcf2edf345a6b281f0ddb6a784` |
| Fotografia com governança sincronizada | `5c6f9cdc56acd5a5c66f54d9f87c3bc6d75542cb` |
| Nova execução publicada | solicitada no issue #2; resultado ainda não confirmado |
| Branch estável | `netlify/teste-fechado` |
| Produção estável | `https://calculaae.netlify.app/` |

## Defeito confirmado

Após tocar em `Montar minha meta`, o onboarding permanecia aberto e o usuário não recebia resultado observável.

A proteção anterior era insuficiente porque verificava textos e estrutura do código, mas não executava o clique final em navegador.

## Correção aplicada

- a etapa final agora possui uma conclusão explícita;
- salva meta líquida, dias, combustível e R$ 1,75/km;
- cria somente a reserva de manutenção de R$ 0,18/km;
- não cria custo mensal automático;
- marca o onboarding como concluído;
- fecha o modal;
- abre a tela Hoje;
- mostra a confirmação `Meta montada`.

## Proteção nova

Foi criado `tests/e2e/onboarding-block-6.spec.js`, que:

1. abre uma instalação nova;
2. percorre as três etapas;
3. confirma R$ 1,75/km;
4. clica em `Montar minha meta`;
5. exige fechamento do modal e abertura de Hoje;
6. confirma o estado salvo e a ausência de custo mensal automático;
7. falha se houver erro JavaScript.

## CI e governança

A execução anterior `31091302707` falhou antes dos testes funcionais porque o `AGENTS.md` da branch estava desatualizado em relação à `main`.

Essa divergência foi corrigida na fotografia `5c6f9cdc56acd5a5c66f54d9f87c3bc6d75542cb`. Uma nova execução publicada foi solicitada depois dessa sincronização.

## O que permaneceu intocado

- fórmulas financeiras gerais;
- registros e dados existentes;
- chave `vetta-driver-intelligence-v3`;
- navegação dos Blocos 1A a 5;
- manifesto, service worker, cache e instalação;
- `main`, branch estável e Netlify.

## Aprendizado

**Aprendizado fechado:** testes de contrato não substituem o clique real do usuário. Todo botão final de fluxo deve ter teste de navegador que confirme ação, persistência, fechamento e destino observável.

## Próximo passo único

Confirmar a nova CI publicada e depois validar fisicamente no celular o clique em `Montar minha meta`.

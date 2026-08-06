# Estado oficial — VETTA (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-06, 06:55, horário de Brasília  
**Estado funcional:** Blocos 1A a 5 validados fisicamente; Bloco 6 corrigido e aguardando nova prova automatizada e validação física.  
**Estado de governança:** skill `vetta-product-ux` instalada e registrada.  
**Alteração funcional em curso:** simplificação da montagem inicial da meta.

## Identificação da branch

| Item | Estado atual |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch em uso pelo GitHub Pages | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de UX |
| Site de validação | `https://vitoohugo333.github.io/VETTA/` |
| Fotografia funcional desta correção | `db51e7ad8aebff30a3e6723a195356bd92d0cb91` |
| Última execução aprovada anterior | `31070928713` sobre `374f0b9f53918d3519185ca72c451a9a8384f7f7` |
| Nova execução publicada | solicitada no issue #2; resultado ainda não confirmado |
| Branch estável | `netlify/teste-fechado` |
| Produção estável | `https://calculaae.netlify.app/` |

Uma fotografia salva é identificada por um commit. A fotografia `db51e7a...` contém a correção solicitada pelo proprietário, mas ainda não pode ser declarada aprovada até a nova CI terminar.

## Estado funcional preservado

Continuam validados fisicamente:

- Bloco 1A — Planejar;
- Bloco 1B — Histórico com Dias e Análise;
- Bloco 1C — Consolidar Hoje;
- Bloco 1D — Navegação final;
- Bloco 2 — Registro diário;
- Bloco 3 — Refinamento de Planejar;
- Bloco 4 — Refinamento de Histórico;
- Bloco 5 — Organização de Mais.

A navegação permanece:

```text
Hoje | Histórico | Planejar | Mais
```

## Bloco 6 — correção da montagem inicial

O proprietário validou a direção visual e corrigiu a lógica de primeiro uso:

- o onboarding não deve pedir contas mensais;
- não deve existir conceito de “contas iniciais”;
- ao tocar em `Montar minha meta`, o VETTA deve montar somente a meta inicial;
- contas e outras reservas devem ser adicionadas depois em `Planejar → Custos e reservas`;
- a estimativa inicial de faturamento deve ser `R$ 1,75 por km`.

### Resultado implementado

- o campo antigo de contas mensais foi retirado da experiência;
- seu valor é forçado para zero antes da conclusão, impedindo a criação automática do custo mensal de R$ 650;
- permanece somente a reserva inicial de manutenção de R$ 0,18 por km;
- o resumo final informa que contas serão adicionadas depois em Planejar;
- o campo de faturamento por km abre com R$ 1,75 e continua editável;
- usuários existentes e dados já salvos permanecem intocados;
- a mesma chave `vetta-driver-intelligence-v3` e a mesma lógica de conclusão continuam sendo usadas.

### Arquivos desta correção

- `onboarding-6.js`: remove contas do primeiro uso, aplica R$ 1,75/km e atualiza a orientação;
- `tests/onboarding-block-6-contract.test.mjs`: impede retorno do campo, do custo automático e do valor anterior;
- `PROJECT_STATE.md`: registra o estado atual e a prova pendente.

### O que permaneceu intocado

- fórmulas financeiras gerais;
- formato dos dados;
- registros, custos, eventos e fechamentos existentes;
- chave de armazenamento;
- navegação dos Blocos 1A a 5;
- manifesto, service worker, cache e instalação;
- branch estável, Netlify e `main`.

## Evidência

Confirmado agora:

- commit `20e8f97882704fce5d54504b31ca5f61126d6d4a`: alterou o módulo de onboarding;
- commit `db51e7ad8aebff30a3e6723a195356bd92d0cb91`: atualizou a proteção determinística;
- comando `/vetta test netlify/teste-fechado-ux published` enviado no issue #2.

Ainda não confirmado:

- resultado da nova CI;
- paridade da fotografia `db51e7a...` no GitHub Pages;
- validação física desta correção no celular.

## Aprendizado

**Aprendizado fechado:** a primeira configuração deve pedir apenas dados necessários para produzir um primeiro resultado compreensível. Custos detalhados pertencem ao fluxo específico de Planejar, não ao onboarding.

## Próximo passo único

Aguardar a conclusão da CI publicada e, depois, validar no celular que o onboarding mostra R$ 1,75/km, não pede contas e monta a meta sem criar custo mensal automático.

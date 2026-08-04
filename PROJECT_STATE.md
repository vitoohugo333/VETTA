# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03  
**Estado:** tentativa anterior do Bloco 1 revertida; interface restaurada; plano reescrito com destino explícito de cada elemento.  
**Alteração em curso:** nenhuma no aplicativo; próximo bloco ainda depende de autorização específica.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch estável dos testadores | `netlify/teste-fechado` |
| Site estável dos testadores | `https://calculaae.netlify.app` |
| Branch de desenvolvimento UX | `netlify/teste-fechado-ux` |
| Ambiente UX | GitHub Pages apontado manualmente para a branch UX |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
| Branch histórica permanente | `migration/vetta-clean-3-5-1` |

## Reversão concluída

A mudança visual anterior do Bloco 1 foi retirada da branch UX.

Foram restaurados:

- navegação original `Início | Dia | Histórico | Ajustes | Mais`;
- todos os cartões originais da tela Início;
- gráfico de pizza `Distribuição da meta`;
- situação semanal;
- controle de objetivo mensal;
- seletor de dias de trabalho;
- atalho de planejamento.

A restauração foi feita devolvendo `styles.css` exatamente ao conteúdo anterior à mudança visual.

O teste `tests/navigation-ux-contract.test.mjs`, que exigia a ocultação desses elementos, foi removido.

## O que permaneceu

- a branch UX continua separada da versão dos testadores;
- Netlify continua ligado à branch estável;
- `main` continua fora deste trabalho;
- cálculos, dados, `app.js`, PWA e acesso não foram alterados;
- a regra de não pedir autorização duplicada para etapas operacionais previsíveis permanece válida;
- a PR #1 permanece intocada.

## Plano reescrito

O Plano 01 agora contém:

- inventário dos elementos atuais;
- destino exato de cada elemento;
- forma de acesso futura;
- regra para itens visíveis, movidos, recolhidos, substituídos ou removidos;
- proibição de ocultar por CSS sem destino visível;
- mapa completo de Hoje, Registro, Histórico, Planejar, Mais e elementos globais;
- ordem segura de execução em Blocos 1A, 1B, 1C e 1D;
- tabela obrigatória para todo contrato futuro.

## Nova ordem do trabalho

1. **Bloco 1A — construir Planejar sem retirar nada de Hoje**;
2. **Bloco 1B — construir Histórico com Dias e Análise**;
3. **Bloco 1C — consolidar Hoje somente após os destinos estarem validados**;
4. **Bloco 1D — ativar a navegação final de quatro áreas**.

Nenhum elemento poderá desaparecer durante a transição.

## Validação física

A validação anterior confirmou que o fluxo simplificado parecia mais limpo, mas também revelou a regressão de acesso ao gráfico e a outros elementos.

Após a reversão, a interface restaurada ainda precisa ser recarregada no GitHub Pages para confirmação visual. Como a alteração devolve exatamente o CSS anterior, não existe mudança nova de produto além da restauração.

## Aprendizado fechado

Mudança de interface não pode ser tratada apenas como redução visual. Todo elemento afetado precisa de destino, acesso e critério de aceite definidos antes da alteração.

O Plano 01 passou a exigir esse mapa como parte do contrato.

## Próximo passo único

Apresentar o contrato executável do **Bloco 1A — Planejar**, citando cada elemento que será duplicado ou realocado, sem retirar nada de Hoje durante esse bloco.

Esse próximo passo será apenas contrato e não autoriza implementação até aprovação explícita do proprietário.

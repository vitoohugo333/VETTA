# INC-0004 — autorização duplicada em etapa previsível

## Sintoma

Depois de o proprietário autorizar a criação da branch UX e a preparação do Bloco 1, o trabalho foi interrompido para pedir nova confirmação sobre selecionar a branch no GitHub Pages. O proprietário esperava encontrar o bloco já implementado e usar a troca do Pages apenas para validar.

## Causa imediata

A etapa manual de apontar o GitHub Pages foi tratada como uma nova decisão de produto, embora fosse somente uma consequência operacional conhecida do bloco já autorizado.

## Causa estrutural

As regras diferenciavam deploy automático de publicação manual, mas não deixavam explícito que uma configuração manual previsível feita pelo proprietário não suspende a implementação já autorizada.

## Falha de detecção

O fechamento do preparo da branch foi interpretado como fim do bloco, ignorando o resultado observável que o proprietário havia aprovado: ter a alteração pronta para então apontar o Pages e validar.

## Correção e prevenção

- A branch UX passou a receber imediatamente o Bloco 1 já autorizado.
- Quando um bloco já autorizado inclui uma branch de validação e o proprietário fará apenas o apontamento conhecido do GitHub Pages, não pedir autorização adicional nem aguardar a configuração para implementar.
- Aguardar somente quando a escolha de ambiente ainda mudar o alvo, o risco ou a publicação de produção.
- Depois da implementação, tratar a seleção do Pages como passo de validação e confirmar o conteúdo servido quando possível.

## Prova

- mudança implementada somente em `netlify/teste-fechado-ux`;
- branch estável do Netlify permaneceu intocada;
- contrato automatizado de navegação criado em `tests/navigation-ux-contract.test.mjs`;
- validação física da interface permanece obrigatória.

## Alcance

- CalculaAê específico;
- aplicação web reutilizável;
- engenharia geral.

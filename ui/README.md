# UI Premium VETTA

Esta pasta contém a autoridade visual e comportamental da Refatoração 360.

- `model.js` preserva contratos financeiros e armazenamento.
- `store.js` controla somente estado de interface, navegação e retorno.
- `context.js` expõe o contexto compartilhado da experiência.
- `premium.css` define a gramática visual principal.
- `main.js` coordena telas, ações e persistência funcional.
- `interaction.js` adiciona a gramática transversal de interação: resposta ao toque, explicações sob demanda, continuidade, busca por intenção, progresso visual e estados amigáveis. Ele não recria telas nem altera cálculos.
- `friendly.css` contém somente estilos associados a essa gramática comportamental, incluindo movimento reduzido e estados de foco.
- `screens/` continua sendo a única fonte das superfícies de produto.

A interface legada permanece no repositório apenas como referência/rollback durante a substituição e não deve ser empilhada sobre esta camada.

## Regra de arquitetura

A camada amigável pode **enriquecer um elemento já renderizado**, mas não pode virar uma segunda aplicação sobre a primeira. Qualquer comportamento que passe a ser estrutural de uma tela deve migrar para o respectivo arquivo de `screens/` quando houver mudança funcional futura nessa tela.

## Invariantes

- nenhuma microinteração muda matemática financeira;
- nenhuma animação é condição para concluir uma tarefa;
- gestos possuem alternativa por toque/teclado;
- `prefers-reduced-motion` reduz movimento não essencial;
- rascunhos e dados existentes continuam preservados pelo modelo oficial;
- PWA deve cachear a autoridade visual e comportamental da mesma fotografia.

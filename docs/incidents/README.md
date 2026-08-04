# Incidentes e aprendizados técnicos

Este diretório preserva problemas relevantes e conhecimentos confirmados que devem orientar o CalculaAê e projetos futuros.

As regras obrigatórias estão em [`LEARNING_RULES.md`](../../LEARNING_RULES.md). Este arquivo funciona como índice e guia prático.

## Tipos aceitos

- **Incidente:** falha real ou risco concreto que afetou ou poderia afetar o produto.
- **Aprendizado preventivo:** descoberta confirmada e reutilizável, mesmo sem falha grave.

## Regra principal

Registrar somente conhecimento com causa confirmada e valor futuro. Hipóteses, palpites e detalhes irrelevantes não viram regra permanente.

## Índice

| ID | Tipo | Tema | Alcance | Estado |
|---|---|---|---|---|
| [INC-0001](./INC-0001-barreira-de-acesso-bloqueou-arquivos-do-pwa.md) | Incidente | Barreira de acesso bloqueou arquivos técnicos do PWA | PWA reutilizável; aplicação web reutilizável | Confirmado |
| [INC-0002](./INC-0002-piscada-na-abertura-standalone.md) | Incidente | Tela de instalação apareceu antes do app instalado | PWA reutilizável | Confirmado |
| [INC-0003](./INC-0003-automacao-remota-sem-burlar-instalacao.md) | Aprendizado preventivo | Navegador automatizado testa o app sem liberar acesso comum | PWA reutilizável; aplicação web reutilizável | Confirmado |
| [INC-0004](./INC-0004-autorizacao-duplicada-em-deploy-previsivel.md) | Aprendizado preventivo | Etapa operacional previsível não exige autorização duplicada | Governança e publicação de validação | Confirmado |
| [INC-0005](./INC-0005-comparacao-de-dados-durante-abertura-pwa.md) | Aprendizado preventivo | Comparar dados somente após a abertura estabilizar | PWA, armazenamento e testes | Confirmado |
| [INC-0006](./INC-0006-hidden-sobrescrito-na-navegacao-final.md) | Incidente | `hidden` foi vencido pelo estilo da navegação | Interface, CSS e testes de PWA | Confirmado |
| [INC-0007](./INC-0007-classe-tailwind-usada-como-seletor-css.md) | Incidente | Classe Tailwind com colchetes usada como seletor CSS | Interface e testes de navegador | Confirmado |

## Numeração

- Usar `INC-0001`, `INC-0002` e assim por diante para incidentes e aprendizados preventivos.
- O campo `Tipo` diferencia falha real de descoberta preventiva.
- Não reutilizar número apagado.

## Como criar

1. Copiar [`TEMPLATE.md`](./TEMPLATE.md).
2. Preencher somente fatos confirmados.
3. Citar evidências identificáveis: arquivo, teste, commit, deploy ou validação física.
4. Resumir a regra preventiva no arquivo especializado correspondente.
5. Criar ou indicar a prova contra regressão.
6. Atualizar este índice.

## Critério de qualidade

Um registro deve permitir que outro agente responda sem depender do chat:

- o que aconteceu;
- por que aconteceu;
- por que não foi detectado antes;
- como foi resolvido;
- como evitar problemas iguais ou semelhantes;
- como provar que não voltou;
- em quais outros projetos o conhecimento pode ser reutilizado.

## Praticidade

- Não registrar erros pequenos sem aprendizado relevante.
- Não exigir autorização extra dentro de um bloco já aprovado.
- Mitigar urgências antes de escrever o registro.
- Antes de encerrar o bloco, fechar o aprendizado aplicável.
- Manter o texto objetivo; não copiar conversas inteiras nem criar diário de comandos.

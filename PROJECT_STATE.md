# Estado oficial — VETTA (`refatoracao-360-ux`)

**Atualizado em:** 2026-08-08, horário de Brasília  
**Estado:** Refatoração 360 com evolução **UX Amiga / interação viva** implementada; gate automatizado da fotografia documental final ainda deve concluir; **aguardando validação física no celular**.  
**Objetivo:** fazer o VETTA funcionar como um copiloto financeiro humano, autoguiado, responsivo e premium, preservando cálculos e dados.

## Identificação viva

| Item | Estado confirmado agora |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `refatoracao-360-ux` |
| Fotografia de entrada deste bloco | `e38e8ad22d744b7e1ee751c4335e07ed342a7359` |
| Fotografia de implementação antes deste checkpoint de estado | `711a3ae2e620dc355406183b066926406d9a97b7` |
| PR da branch | nenhum confirmado |
| `main` | não alterada por este bloco |
| Merge/tag/release | não realizados |
| Publicação manual | não realizada |
| Política de ambiente na própria branch | `ci/branch-policy.json` declara GitHub Pages e verifica a autoridade premium + assets da UX Amiga |
| SHA efetivamente servido pelo GitHub Pages | **não confirmado** |
| Validação física | **pendente no celular do proprietário** |

> O commit que grava este próprio `PROJECT_STATE.md` é uma fotografia posterior à implementação acima. Por isso ele deve receber novamente o gate `full` antes do fechamento operacional.

## Confirmado agora

### Autoridade ativa da experiência

A aplicação ativa continua sendo `ui/`, sem reativar a pilha visual legada.

- `ui/model.js`: contratos financeiros e armazenamento;
- `ui/store.js`: estado de interface, navegação e retorno;
- `ui/context.js`: contexto compartilhado;
- `ui/main.js`: controlador funcional da experiência;
- `ui/premium.css`: gramática visual principal;
- `ui/screens/`: superfícies de produto;
- `ui/interaction.js`: gramática transversal de interação;
- `ui/friendly.css`: estados visuais e microinterações dessa gramática.

`app-shell.html` carrega a autoridade premium e a UX Amiga. Os controladores visuais legados continuam no repositório apenas como referência/rollback e não foram recolocados no shell ativo.

## Bloco — UX Amiga / interação viva

### Sistema transversal

- resposta visual ao toque;
- háptica discreta quando suportada;
- `aria-live` para confirmações relevantes;
- entrada de tela curta e sem dependência funcional da animação;
- foco por teclado visível;
- `prefers-reduced-motion` respeitado;
- alternativas por toque/teclado para interações acionáveis.

### Agora

- progresso vivo da semana;
- quantidade de dias registrados no período;
- números do Hero explicáveis sob demanda;
- explicação humana de projeção e leitura VETTA sem tirar o usuário do contexto.

### Registrar

- estado explícito de rascunho protegido/salvando/salvo;
- aviso amigável quando a data já possui registro;
- preservada a regra de atualizar a mesma data sem duplicar;
- teclado numérico favorecido nos campos aplicáveis;
- `Enter` avança pelos campos;
- CTA de salvar permanece alcançável em tela móvel;
- autofocus no faturamento quando apropriado.

### Resultados

- atalhos para melhor líquido e melhor eficiência;
- barras do gráfico acionáveis e ligadas ao dia real correspondente;
- acesso por teclado ao gráfico;
- perguntas humanas como “Por que ganhei mais em alguns dias?” e “Estou melhorando meu ritmo?”;
- explicações baseadas nos registros existentes, sem transformar dinheiro em gamificação punitiva.

### Custos

- faixa rápida de compromissos ordenados por urgência;
- toque abre o custo correspondente;
- custos fixos traduzidos em parcela aproximada por dia planejado;
- estado de pagamento continua separado da matemática financeira.

### Plano

- progresso visual das quatro decisões do plano;
- CTA `Continuar meu plano` quando há etapa incompleta;
- CTA `Revisar meu plano` quando a base está montada;
- ausência de custos não é tratada como erro obrigatório.

### Mais / Dados

- busca global por intenção: meta, agenda, custos, combustível, backup, relatório, resultados, registro e notificações;
- estado local da última exportação de backup, armazenado fora da chave financeira principal;
- navegação abre a função correspondente, sem exigir que o usuário conheça a arquitetura do app.

### Onboarding

- jornada visual de três etapas;
- progresso explícito;
- resumo do primeiro plano antes de entrar no VETTA;
- perguntas continuam adaptadas ao tipo de veículo.

## PWA

O conjunto offline ativo foi elevado para `vetta-premium-ui-2` para incluir na mesma fotografia:

- `ui/interaction.js`;
- `ui/friendly.css`;
- autoridade premium já existente;
- manifesto e ícones.

A primeira ativação e uma atualização continuam estados distintos pelo contrato `HAD_ACTIVE_WORKER`.

## Evidência e falha intermediária classificada

A execução `full` intermediária `31268682720`, sobre uma fotografia anterior ao fechamento do bloco, confirmou sintaxe dos módulos novos e vários contratos determinísticos, mas falhou em `tests/pwa-standalone-launch.test.mjs` porque o teste ainda exigia literalmente o cache `vetta-premium-ui-1`.

**Classificação:** contrato de teste desatualizado, não falha do produto. O Service Worker havia mudado corretamente de geração para impedir mistura de assets antigos e novos.

**Correção:** o teste agora exige `vetta-premium-ui-2`, `ui/interaction.js` e `ui/friendly.css` como parte do conjunto offline.

**Aprendizado fechado:** `docs/incidents/2026-08-08-friendly-ux-pwa-cache-contract.md` registra que geração de cache, `APP_SHELL`, política de arquivos servidos e contratos PWA devem evoluir juntos.

## Proteções preservadas

- chave financeira principal `vetta-driver-intelligence-v3`;
- registros existentes;
- cálculos e significado econômico dos custos;
- custo percentual preservado;
- pagamento administrativo não remove custo da matemática;
- mesma data atualiza registro em vez de duplicar;
- meta zero continua representando plano não configurado;
- `main`;
- `netlify/teste-fechado`;
- merge, tag, release e publicação manual.

## Sincronização Notion

O bloco **Experimento — Refatoração 360 UX** recebeu o checkpoint da UX Amiga e o **Registro de Alterações do Notion** recebeu `N-019 — UX Amiga / camada de interação viva`.

A prova final da CI deve ser acrescentada ao Notion depois da execução definitiva, sem antecipar um resultado ainda não comprovado.

## Estado de validação

- **Sintaxe/módulos novos:** comprovados na execução intermediária antes da falha de contrato PWA.
- **Contratos determinísticos da fotografia final:** gate `full` final ainda precisa concluir após este checkpoint documental.
- **Chromium / Firefox / WebKit da fotografia final:** ainda não comprovados após este checkpoint.
- **GitHub Pages / SHA servido:** **não confirmado**.
- **Celular:** **aguardando validação física**.

## Próximo passo único

Executar o gate `full` desta fotografia final. Se a automação ficar verde, o único passo humano restante deste bloco é validar fisicamente no celular a ergonomia, animações, teclado, toque e continuidade. Até essa validação, não promover para `main`, não fazer merge e não declarar publicação.
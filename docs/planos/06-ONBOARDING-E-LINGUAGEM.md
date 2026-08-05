# Bloco 6 — Onboarding e linguagem

**Estado:** contrato executável preparado; implementação funcional ainda não iniciada  
**Branch:** `netlify/teste-fechado-ux`  
**Ambiente de validação:** GitHub Pages  
**Autorização do proprietário:** 2026-08-04, 21:28, horário de Brasília

## 1. Objetivo

Fazer a primeira configuração explicar o VETTA com linguagem simples, mostrar o efeito de cada resposta e levar o motorista até a tela Hoje sem alterar fórmulas, estrutura dos dados ou funcionamento local-first.

Este bloco também corrige textos confusos ou técnicos diretamente ligados ao primeiro uso. Não autoriza uma revisão ilimitada de toda a interface.

## 2. Estado atual confirmado

O aplicativo já possui onboarding obrigatório para instalações novas, controlado por `onboardingComplete` dentro da mesma chave `vetta-driver-intelligence-v3`.

O fluxo atual tem três etapas:

1. meta mensal e quantidade de dias por semana;
2. combustível, preço e rendimento;
3. receita média por km e custos mensais iniciais.

Ao concluir, o fluxo grava os mesmos campos já consumidos pelo aplicativo, cria a reserva de manutenção e o custo mensal inicial, marca `onboardingComplete` e abre o aplicativo.

## 3. Proteções obrigatórias

O Bloco 6 não pode alterar:

- fórmulas financeiras;
- chave `vetta-driver-intelligence-v3`;
- formato de `targetProfit`, `workWeekdays`, `fuel`, `revenueKm`, `costs`, `records` ou `events`;
- valores já salvos de usuários existentes;
- regra de que o onboarding aparece somente quando `onboardingComplete` não está concluído;
- importação, exportação, PWA, manifesto, service worker ou cache;
- navegação validada dos Blocos 1A a 5;
- `main`, branch estável ou Netlify.

## 4. Contrato de elementos

| Elemento | Estado atual | Mudança do Bloco 6 | Destino | Como acessar | Pode ficar oculto? | Teste obrigatório |
|---|---|---|---|---|---|---|
| Modal inicial | três passos obrigatórios | manter três passos, com introdução curta e propósito claro | primeira abertura | automático em estado novo | somente após conclusão válida | aparece em estado novo e não aparece em estado concluído |
| Progresso 1/3, 2/3, 3/3 | visível | manter, acrescentando rótulo compreensível da etapa | cabeçalho do onboarding | automático | não | sequência e largura corretas |
| Meta mensal | campo numérico | explicar que é o valor líquido que o motorista deseja conservar | etapa 1 | campo visível | não | validação positiva e persistência idêntica |
| Dias por semana | atalhos 5, 6 e 7 | explicar que o valor divide a meta pelos dias planejados | etapa 1 | botões visíveis | não | seleção atual, conversão em `workWeekdays` e retorno entre etapas |
| Combustível | seleção atual | usar pergunta direta e explicar que afeta o custo por km | etapa 2 | campo visível | não | todos os tipos existentes continuam disponíveis |
| Preço | campo atual | rótulo e ajuda por unidade, sem mudar o valor | etapa 2 | campo visível | não | preço positivo e unidade correta |
| Rendimento | campo atual | explicar com exemplo curto `km/L` ou `km/m³` | etapa 2 | campo visível | não | rendimento positivo e unidade correta |
| Receita média por km | campo atual | trocar linguagem técnica por “quanto costuma faturar por km” | etapa 3 | campo visível | não | zero ou vazio mantém padrão atual; valor informado é preservado |
| Custos mensais iniciais | campo único | explicar que representa contas que precisam sair do trabalho | etapa 3 | campo visível | não | zero não cria custo; valor positivo cria somente um custo |
| Reserva de manutenção inicial | criada automaticamente | tornar essa criação explícita antes da conclusão | resumo da etapa 3 | texto visível | não | continua sendo criada uma única vez com o mesmo valor |
| Botão Voltar | volta de etapa | manter valores preenchidos e deixar ação clara | etapas 2 e 3 | botão visível | apenas na etapa 1 | ida e volta sem perda |
| Botão Continuar | avança etapas | mostrar ação ligada ao próximo assunto | etapas 1 e 2 | botão principal | não | não avança com dados obrigatórios inválidos |
| Botão final | “Começar a usar” | apresentar resumo curto do que será configurado | etapa 3 | botão principal | não | salva uma vez, fecha modal e abre Hoje |
| Mensagem final | toast genérico | confirmar que a meta foi montada e indicar onde editar | após conclusão | automática | temporária | texto aparece e estado fica concluído |
| Dados existentes | onboarding não aparece | preservar integralmente | aplicativo normal | automático | não se aplica | nenhum modal para estado concluído ou backup importado |

## 5. Direção de linguagem

Os textos devem:

- falar em “meta líquida”, “dias que pretende trabalhar”, “combustível usado nas metas”, “quanto costuma faturar por km” e “contas mensais”;
- explicar consequência antes de pedir um valor;
- evitar “parâmetros”, “configuração técnica”, “eficiência operacional” e outras expressões sem explicação;
- usar frases curtas;
- não prometer lucro real ou precisão que os dados ainda não sustentam;
- deixar claro que tudo poderá ser alterado depois em Planejar.

## 6. Forma visual

- manter identidade visual, modal, cores, tipografia e três etapas;
- não criar tutorial longo, carrossel promocional ou telas descartáveis;
- cada etapa deve ter um título, uma frase de consequência, campos e uma ajuda curta;
- a etapa final deve mostrar um resumo antes de salvar;
- preservar teclado, rolagem e área segura no celular.

## 7. Estratégia de implementação

Preferência: módulo isolado `onboarding-6.js`, carregado pela cadeia modular existente, que adapta conteúdo e comportamento usando a origem única já existente.

O módulo deve falhar fechado: se algum elemento obrigatório do onboarding não existir, o fluxo anterior permanece funcionando.

`app.js` só poderá ser alterado se a extensão modular não conseguir preservar validação, gravação única e compatibilidade. Qualquer alteração nesse arquivo deve ser mínima e coberta por regressão específica.

## 8. Testes obrigatórios

### Contrato determinístico

- inventário de todos os elementos;
- origem única dos campos e do estado;
- nenhuma nova chave de armazenamento;
- nenhum segundo custo mensal ou segunda reserva;
- fallback completo;
- textos proibidos e textos obrigatórios do contrato.

### Navegador local

- primeira abertura;
- navegação 1 → 2 → 3 e retorno;
- preservação dos valores ao voltar;
- bloqueio de meta, preço e rendimento inválidos;
- conclusão com valores padrão;
- conclusão com valores personalizados;
- criação única dos custos;
- abertura direta de Hoje após concluir;
- recarga sem reapresentar onboarding;
- estado existente e backup importado sem onboarding.

### Cobertura de navegadores e publicação

- Chromium;
- Firefox;
- WebKit;
- GitHub Pages com fotografia exata da branch;
- preservação dos Blocos 1A a 5;
- validação física no Android.

## 9. Critérios de aceite

O Bloco 6 somente poderá ser declarado concluído quando:

1. o motorista entender o efeito de cada resposta sem conhecer termos técnicos;
2. os três passos preservarem os mesmos dados e resultados do fluxo anterior;
3. voltar não apagar campos;
4. concluir não duplicar custos;
5. usuários existentes não receberem o onboarding novamente;
6. todos os testes aplicáveis passarem;
7. o GitHub Pages servir a fotografia testada;
8. o proprietário validar no celular.

## 10. Fora do escopo

- mudar cálculos ou valores padrão;
- transformar onboarding em cadastro de conta;
- adicionar servidor, login ou sincronização;
- revisar todos os textos do aplicativo;
- acessibilidade completa e acabamento geral, reservados ao Bloco 7;
- merge, produção ou mudança de branch publicada.

## 11. Próximo passo

Implementar este contrato integralmente na branch UX, executar a regressão proporcional e publicar automaticamente no GitHub Pages. Até essa implementação, o onboarding funcional anterior permanece intocado.

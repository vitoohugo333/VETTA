# Plano 01 — Consolidação da experiência

**Estado:** ATIVO — Blocos 1A a 3 validados fisicamente; Bloco 4 aprovado tecnicamente e aguardando validação física  
**Atualizado em:** 2026-08-04, horário de Brasília  
**Branch de desenvolvimento:** `netlify/teste-fechado-ux`  
**Ambiente de validação:** GitHub Pages  
**Princípio:** simplificar sem apagar, esconder ou perder recursos

## 1. Objetivo

Reorganizar o CalculaAê para que o motorista encontre rapidamente o que precisa, sem perder recursos, cálculos, dados ou caminhos de acesso.

Navegação final:

```text
Hoje | Histórico | Planejar | Mais
```

`Registrar meu dia` continua como ação destacada em Hoje, sem ocupar uma quinta aba.

## 2. Regra obrigatória de escopo

Nenhum elemento existente pode ser removido, escondido, recolhido ou movido sem o contrato do bloco informar:

1. nome do elemento;
2. local atual;
3. destino exato;
4. forma de acesso;
5. comportamento quando fechado ou recolhido;
6. justificativa;
7. teste necessário;
8. validação no celular.

As únicas situações permitidas são:

- permanece visível;
- muda de área com caminho visível;
- fica recolhido, mas com botão ou resumo visível;
- é substituído por solução equivalente ou melhor após autorização específica;
- é removido permanentemente após autorização explícita citando o item.

Ocultar por CSS sem destino visível é proibido.

## 3. Proteções permanentes

O Plano 01 não altera:

- fórmulas financeiras;
- significado ou formato dos dados;
- registros, custos, eventos e configurações salvas;
- chave `vetta-driver-intelligence-v3`;
- funcionamento local-first;
- PWA, manifesto, service worker, cache ou acesso;
- identidade visual aprovada;
- `main`;
- branch estável e Netlify dos testadores.

## 4. Mapa completo dos elementos

### 4.1 Hoje

| Elemento | Destino permanente | Estado atual |
|---|---|---|
| Meta de faturamento por dia | Hoje | visível |
| Líquido planejado | Hoje | visível |
| Rodagem estimada | Hoje | visível |
| Custo de combustível por km | Hoje; edição em Planejar | visível |
| Texto de situação da meta | Hoje | visível |
| Registrar meu dia | Hoje | visível e abre o registro como tela secundária |
| Situação do mês | Hoje | visível |
| Progresso do mês | Hoje | visível |
| Líquido gerado | Hoje | visível |
| Projeção | Hoje | visível |
| Dias restantes | Hoje | visível |
| Leitura do VETTA | Hoje | visível |
| Razões da recomendação | Hoje | visíveis quando existentes |
| Ver planejamento do mês | Hoje → Planejar | atalho visível com retorno para Hoje |
| Objetivo mensal líquido | Planejar → Metas | retirado visualmente de Hoje |
| Seletor 5, 6 ou 7 dias | Planejar → Agenda | retirado visualmente de Hoje |
| Folgas extras | Planejar → Agenda | retirado visualmente de Hoje |
| Situação e números da semana | Histórico → Semana atual | retirados visualmente de Hoje |
| Gráfico Distribuição da meta | Planejar → Distribuição | retirado visualmente de Hoje |
| Faturamento bruto, rodagem, custos e objetivo do gráfico | Planejar → Distribuição | retirados visualmente de Hoje |

As duplicações retiradas de Hoje continuam no HTML como retorno seguro para os consumidores atuais. O módulo só as oculta depois de confirmar todos os destinos. Se uma origem ou destino faltar, Hoje permanece completo.

### 4.2 Registro do dia

| Elemento | Destino | Estado após Bloco 2 |
|---|---|---|
| Acesso principal | Hoje → Registrar meu dia | visível |
| Tela e formulário do registro | Registrar meu dia | preservados |
| Data | área essencial | visível |
| Faturamento | área essencial | visível e prioritário |
| Quilômetros | área essencial | visível e prioritário |
| Horas online | Detalhes opcionais | recolhido, mas acessível |
| Combustível gasto | Detalhes opcionais | recolhido, mas acessível |
| Prévia de custos | Resultado antes de salvar | visível |
| Líquido calculado | Resultado antes de salvar | destacado |
| Receita por km e diferença da meta | Resultado antes de salvar | visíveis |
| Salvar | Registro | permanece e usa a gravação original |
| Limpar | Registro | permanece |
| Confirmação após salvar | Registro concluído | mostra faturamento, quilômetros e líquido |
| Editar depois de salvar | Registro concluído → Editar este dia | reabre a mesma data |
| Concluir | Registro concluído → Hoje | retorna para Hoje |
| Edição pelo Histórico | Histórico → Dias registrados → Editar | usa o mesmo formulário |

O Bloco 2 não criou outra persistência. A regra canônica continua sendo um registro por data: salvar novamente a mesma data atualiza o registro existente.

### 4.3 Histórico

Histórico abre como um resumo curto com quatro ilhas visíveis. Cada ilha abre uma tela própria usando os mesmos elementos, registros, cálculos e gráfico já existentes.

| Elemento | Destino | Estado após Bloco 4 |
|---|---|---|
| Resumo do Histórico | barra inferior → Histórico | visível e curto |
| Lista de dias | Histórico → Dias registrados | tela própria |
| Editar dia | Histórico → Dias registrados | disponível e integrado ao Bloco 2 |
| Excluir dia | Histórico → Dias registrados | disponível com confirmação |
| Quantidade de dias | Histórico → Resumo e evolução | tela própria |
| Média de faturamento/km | Histórico → Resumo e evolução | tela própria |
| Líquido acumulado | Histórico → Resumo e evolução | tela própria |
| Gráfico de evolução | Histórico → Resumo e evolução | tela própria |
| Situação semanal | Histórico → Semana atual | tela própria |
| Meta, realizado e média/km semanais | Histórico → Semana atual | tela própria |
| Comparação entre dias | Histórico → Comparação | tela própria |
| Abas antigas Dias e Análise | fallback interno | preservadas e não exibidas quando o Bloco 4 está ativo |

Regras de retorno:

- dentro de um assunto, `Voltar para Histórico` retorna ao resumo curto;
- o botão Voltar do Android ou navegador faz o mesmo retorno;
- tocar novamente em Histórico enquanto uma área está aberta retorna ao resumo;
- o gráfico é criado quando Resumo e evolução fica visível;
- editar e excluir continuam atuando sobre o mesmo registro original;
- se qualquer elemento obrigatório não for encontrado, o Bloco 4 não ativa e `Dias | Análise` permanece disponível como fallback.

### 4.4 Planejar

Planejar abre como um resumo curto. Cada assunto possui uma ilha visível e abre uma tela própria, reutilizando os mesmos campos e eventos originais.

| Elemento | Destino | Estado após Bloco 3 |
|---|---|---|
| Resumo do plano | barra inferior → Planejar | visível e curto |
| Objetivo líquido | Planejar → Metas | tela própria |
| Dias da semana e atalhos 5/6/7 | Planejar → Agenda | tela própria |
| Folgas extras | Planejar → Agenda | tela própria |
| Tipo, nome, preço e rendimento do combustível | Planejar → Operação | tela própria |
| Receita média por km | Planejar → Operação | tela própria |
| Custos mensais, semanais, únicos, por km e percentuais | Planejar → Custos e reservas | tela própria |
| Reservas | Planejar → Custos e reservas | tela própria |
| Gráfico de pizza e detalhamento | Planejar → Distribuição | tela própria |
| Aprendizado local | Planejar → Aprendizado | tela própria |
| Restaurar padrões | Planejar → Opções avançadas | tela própria e protegida |
| Tela antiga Ajustes | fallback interno | preservada, mas não ocupa a barra final |

Regras de retorno:

- dentro de um assunto, `Voltar para Planejar` retorna ao resumo curto;
- o botão Voltar do Android ou navegador faz o mesmo retorno;
- Planejar aberto pela barra é área principal e não mostra retorno para Hoje;
- Planejar aberto pelo atalho de Hoje mantém, no resumo, o botão que retorna para Hoje;
- valores preenchidos permanecem ao alternar entre assuntos;
- se qualquer seção original obrigatória não for encontrada, o Bloco 3 não ativa e a tela longa anterior é preservada.

### 4.5 Mais

| Elemento | Destino | Regra |
|---|---|---|
| Comparação Gasolina × GNV | Mais → Ferramentas | permanece |
| Relatório mensal | Mais → Relatórios | permanece |
| Exportar e importar | Mais → Dados | permanecem |
| Radar de eventos | Mais → Radar | permanece |
| Criar, editar e excluir evento | Mais → Radar | permanecem |
| Instalação | Mais → Aplicativo | permanece |
| Versão do app | Mais → Aplicativo | permanece |

### 4.6 Elementos globais

| Elemento | Destino | Regra |
|---|---|---|
| Cabeçalho VETTA | áreas principais | permanece |
| Botão Instalar | Mais → Aplicativo; pode existir alerta global | não retirar sem substituição |
| Navegação inferior | Hoje, Histórico, Planejar, Mais | implementada e validada |
| Botão voltar | telas secundárias | preserva origem e formulário |
| Modais de custo, evento e instalação | áreas correspondentes | permanecem |
| Onboarding | fluxo inicial | Bloco 6 |

## 5. Ordem de execução

### Bloco 1A — Construir Planejar

**Estado:** concluído, aprovado pela CI e validado fisicamente.

### Bloco 1B — Construir Histórico com Dias e Análise

**Estado:** concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

### Bloco 1C — Consolidar Hoje

**Estado:** concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

### Bloco 1D — Ativar navegação final

**Estado:** concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

A barra final permanece `Hoje | Histórico | Planejar | Mais`, o Registro continua acessível por Hoje e as rotas antigas de Ajustes convergem para Planejar.

### Bloco 2 — Registro diário

**Estado:** concluído, aprovado pela CI e pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

Entregas:

- faturamento e quilômetros priorizados;
- horas e combustível preservados em `Detalhes opcionais`;
- líquido destacado na prévia;
- confirmação de dia registrado ou atualizado;
- edição da mesma data sem duplicação;
- retorno previsível para Hoje;
- edição pelo Histórico preservada;
- `app.js`, cálculos, dados e PWA intocados.

### Bloco 3 — Refinar Planejar

**Estado:** concluído, aprovado pela CI e pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

Entregas:

- Planejar abre como resumo curto;
- sete ilhas visíveis: Metas, Agenda, Operação, Custos e reservas, Distribuição, Aprendizado e Opções avançadas;
- cada ilha abre tela própria;
- os campos, listas, gráfico e ações originais foram movidos como os mesmos elementos, sem segunda cópia;
- resumos das ilhas refletem os valores atuais;
- alterações de meta, agenda, combustível e custos permanecem entre telas;
- gráfico é redesenhado ao abrir Distribuição;
- retorno por botão e pelo Android/navegador preservado;
- fallback mantém a tela longa anterior se um destino obrigatório faltar;
- nenhum dado, fórmula, chave de armazenamento ou arquivo do PWA foi alterado.

Aceite técnico alcançado na fotografia funcional `0c6f7b3d57ff94cbd4681f6d6323703861c6233b`, execução funcional `30927631513` e execução integral de fechamento `30929247436`.

Aceite físico informado pelo proprietário no celular em 2026-08-04.

### Bloco 4 — Refinar Histórico

**Estado:** implementado, aprovado pela CI e pelo GitHub Pages; **aguardando validação física**.

Entregas:

- Histórico abre como resumo curto;
- quatro ilhas visíveis: Dias registrados, Resumo e evolução, Semana atual e Comparação;
- cada ilha abre tela própria;
- lista, editar, excluir, números, gráfico, semana e comparação usam os mesmos elementos anteriores;
- nenhum registro, cálculo ou gráfico foi duplicado;
- botão de retorno e botão Voltar do Android/navegador preservados;
- estados sem registros e com registros insuficientes permanecem claros;
- fallback mantém `Dias | Análise` caso algum destino obrigatório falte;
- nenhum dado, fórmula, chave de armazenamento ou arquivo do PWA foi alterado.

Aceite técnico alcançado na fotografia integral `3acafd3ebcf0fb51154d4dd8538c3ffa0f35de3f`, execução `30941963581`:

- governança e todos os testes determinísticos;
- Chromium;
- Firefox;
- WebKit;
- quatro ilhas e respectivas telas;
- lista, edição e exclusão;
- resumo, gráfico, semana e comparação;
- estados sem dados;
- preservação dos cálculos e do formulário de registro;
- navegação por botão e histórico;
- paridade dos arquivos públicos;
- interação no GitHub Pages.

### Blocos 5 a 8

- Bloco 5: organização de Mais;
- Bloco 6: onboarding e linguagem;
- Bloco 7: acessibilidade e acabamento;
- Bloco 8: regressão completa e versão candidata.

Esses blocos não podem ser usados como promessa vaga para restaurar algo retirado antes.

## 6. Critério obrigatório para contratos futuros

Antes de qualquer alteração de interface, apresentar:

| Elemento | Estado atual | Mudança | Destino | Como acessar | Pode ficar oculto? | Teste |
|---|---|---|---|---|---|---|

O contrato falha se algum elemento afetado não estiver na tabela.

## 7. Testes mínimos por bloco

- inventário dos elementos antes e depois;
- prova de que nenhum recurso desapareceu sem destino;
- navegação e botão voltar;
- preservação do formulário não salvo;
- cálculos determinísticos;
- dados antigos carregando;
- criação, edição e exclusão aplicáveis;
- Chromium, Firefox e WebKit para interface;
- prova do ambiente publicado quando aplicável;
- validação física no Android.

## 8. Estado atual

- Blocos 1A a 3 concluídos e validados fisicamente;
- Bloco 4 aprovado tecnicamente e servido pelo GitHub Pages;
- Histórico agora abre curto e separa cada consulta em tela própria;
- nenhum registro, ação, número, gráfico ou comparação foi removido;
- `app.js`, `styles.css`, cálculos, formato dos dados e PWA permanecem intocados pelo Bloco 4;
- Bloco 4 permanece **aguardando validação física**;
- Bloco 5 não está autorizado.

# Plano 01 — Consolidação da experiência

**Estado:** ATIVO — Blocos 1A e 1B concluídos; Bloco 1C aprovado tecnicamente e aguardando validação física  
**Atualizado em:** 2026-08-04, horário de Brasília  
**Branch de desenvolvimento:** `netlify/teste-fechado-ux`  
**Ambiente de validação:** GitHub Pages  
**Princípio:** simplificar sem apagar, esconder ou perder recursos

## 1. Objetivo

Reorganizar o CalculaAê para que o motorista encontre rapidamente o que precisa, sem perder recursos, cálculos, dados ou caminhos de acesso.

Navegação-alvo:

```text
Hoje | Histórico | Planejar | Mais
```

`Registrar meu dia` continuará como ação destacada em Hoje, sem ocupar uma quinta aba.

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

| Elemento | Destino permanente | Estado atual após 1C |
|---|---|---|
| Meta de faturamento por dia | Hoje | visível |
| Líquido planejado | Hoje | visível |
| Rodagem estimada | Hoje | visível |
| Custo de combustível por km | Hoje; edição em Planejar | visível |
| Texto de situação da meta | Hoje | visível |
| Registrar meu dia | Hoje | visível |
| Situação do mês | Hoje | visível |
| Progresso do mês | Hoje | visível |
| Líquido gerado | Hoje | visível |
| Projeção | Hoje | visível |
| Dias restantes | Hoje | visível |
| Leitura do VETTA | Hoje | visível |
| Razões da recomendação | Hoje | visíveis quando existentes |
| Ver planejamento do mês | Hoje até a navegação final | visível |
| Objetivo mensal líquido | Planejar → Metas | retirado visualmente de Hoje |
| Seletor 5, 6 ou 7 dias | Planejar → Agenda | retirado visualmente de Hoje |
| Folgas extras | Planejar → Agenda | retirado visualmente de Hoje |
| Situação e números da semana | Histórico → Análise → Semana atual | retirados visualmente de Hoje |
| Gráfico Distribuição da meta | Planejar → Distribuição da meta | retirado visualmente de Hoje |
| Faturamento bruto, rodagem, custos e objetivo do gráfico | Planejar → Distribuição da meta | retirados visualmente de Hoje |

As duplicações retiradas continuam no HTML como retorno seguro para os consumidores atuais. O módulo só as oculta depois de confirmar todos os destinos. Se uma origem ou destino faltar, Hoje permanece completo.

### 4.2 Registro do dia

| Elemento | Destino | Regra |
|---|---|---|
| Data | Registrar meu dia | permanece |
| Faturamento | Registrar meu dia | permanece |
| Quilômetros | Registrar meu dia | permanece |
| Horas online | Registro → Opcionais | não remover |
| Combustível gasto | Registro → Opcionais | não remover |
| Prévia bruto/custos/líquido | Registrar meu dia | permanece |
| Salvar | Registrar meu dia | permanece |
| Limpar | Registrar meu dia | permanece |

### 4.3 Histórico

| Elemento | Destino | Estado |
|---|---|---|
| Lista de dias | Histórico → Dias | disponível |
| Editar dia | Histórico → Dias | disponível |
| Excluir dia | Histórico → Dias | disponível |
| Quantidade de dias | Histórico → Análise → Resumo | disponível |
| Média de faturamento/km | Histórico → Análise → Resumo | disponível |
| Líquido acumulado | Histórico → Análise → Resumo | disponível |
| Gráfico de evolução | Histórico → Análise | disponível |
| Comparação entre dias | Histórico → Análise | disponível |
| Situação semanal | Histórico → Análise → Semana atual | destino permanente disponível |

### 4.4 Planejar

| Elemento | Destino | Estado |
|---|---|---|
| Objetivo líquido | Planejar → Metas | disponível |
| Dias da semana e atalhos 5/6/7 | Planejar → Agenda | disponíveis |
| Folgas extras | Planejar → Agenda | disponível |
| Tipo, nome, preço e rendimento do combustível | Planejar → Operação e combustível | disponíveis |
| Receita média por km | Planejar → Operação | disponível |
| Custos mensais, semanais, únicos, por km e percentuais | Planejar → Custos e reservas | disponíveis |
| Reservas | Planejar → Custos e reservas | disponíveis |
| Aprendizado local | Planejar → Aprendizado | disponível |
| Restaurar padrões | Planejar → Opções avançadas | disponível e protegido |
| Gráfico de pizza e detalhamento | Planejar → Distribuição da meta | disponíveis |

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
| Navegação inferior | Hoje, Histórico, Planejar, Mais | somente no Bloco 1D |
| Botão voltar | telas secundárias | preservar origem e formulário |
| Modais de custo, evento e instalação | áreas correspondentes | permanecem |
| Onboarding | fluxo inicial | Bloco 6 |

## 5. Ordem de execução

### Bloco 1A — Construir Planejar

**Estado:** concluído, aprovado pela CI e validado fisicamente.

- Planejar completo foi construído;
- gráfico de pizza e números associados estão acessíveis;
- usa a mesma fonte de dados do aplicativo.

### Bloco 1B — Construir Histórico com Dias e Análise

**Estado:** concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

- Dias preserva lista, edição e exclusão;
- Análise reúne resumo, gráfico, comparação e semana atual;
- não criou novo estado persistido.

### Bloco 1C — Consolidar Hoje

**Estado:** implementado, aprovado pela CI e pelo GitHub Pages; aguardando validação física.

Entregas executadas:

- Hoje mantém resumo diário, Registro do dia, situação mensal e leitura do VETTA;
- objetivo mensal e agenda aparecem somente em Planejar;
- semana aparece em Histórico → Análise;
- gráfico e detalhamento aparecem em Planejar;
- o atalho para Planejar continua em Hoje;
- navegação inferior continua com cinco itens;
- retirada reversível e condicionada à existência dos destinos;
- nenhuma regra de CSS específica, remoção física ou alteração de dados.

Aceite técnico alcançado:

- testes determinísticos aprovados;
- Chromium, Firefox e WebKit aprovados;
- dados financeiros e de uso preservados;
- GitHub Pages com arquivos e interação aprovados.

Aceite pendente:

- validação física da tela Hoje consolidada.

### Bloco 1D — Ativar navegação final

**Estado:** não autorizado.

Somente depois da validação física do Bloco 1C:

- trocar `Início | Dia | Histórico | Ajustes | Mais` por `Hoje | Histórico | Planejar | Mais`;
- retirar Dia da barra apenas porque `Registrar meu dia` está acessível em Hoje;
- retirar Ajustes da barra apenas porque Planejar está completo;
- preservar botão voltar, estado ativo e formulário não salvo.

### Bloco 2 — Registro diário

- priorizar faturamento e quilômetros;
- recolher opcionais sem removê-los;
- aprimorar prévia e confirmação;
- preservar edição e um registro por data.

### Blocos 3 a 8

- Bloco 3: refinamento de Planejar;
- Bloco 4: refinamento de Histórico;
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

- Bloco 1A concluído e validado fisicamente;
- Bloco 1B concluído e validado fisicamente;
- Bloco 1C aprovado tecnicamente e publicado no GitHub Pages;
- Hoje está consolidado sem retirar acesso aos recursos;
- Planejar mantém meta, agenda e distribuição;
- Histórico → Análise mantém a semana;
- navegação ainda possui cinco itens;
- `app.js`, `styles.css`, cálculos, dados e PWA permanecem intocados pelo Bloco 1C;
- Bloco 1C permanece **aguardando validação física**;
- Bloco 1D não está autorizado.

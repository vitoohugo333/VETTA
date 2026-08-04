# Plano 01 — Consolidação da experiência

**Estado:** ATIVO — Blocos 1A, 1B e 1C concluídos; Bloco 1D aprovado tecnicamente e aguardando validação física  
**Atualizado em:** 2026-08-04, horário de Brasília  
**Branch de desenvolvimento:** `netlify/teste-fechado-ux`  
**Ambiente de validação:** GitHub Pages  
**Princípio:** simplificar sem apagar, esconder ou perder recursos

## 1. Objetivo

Reorganizar o CalculaAê para que o motorista encontre rapidamente o que precisa, sem perder recursos, cálculos, dados ou caminhos de acesso.

Navegação final implementada:

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
| Situação e números da semana | Histórico → Análise → Semana atual | retirados visualmente de Hoje |
| Gráfico Distribuição da meta | Planejar → Distribuição da meta | retirado visualmente de Hoje |
| Faturamento bruto, rodagem, custos e objetivo do gráfico | Planejar → Distribuição da meta | retirados visualmente de Hoje |

As duplicações retiradas de Hoje continuam no HTML como retorno seguro para os consumidores atuais. O módulo só as oculta depois de confirmar todos os destinos. Se uma origem ou destino faltar, Hoje permanece completo.

### 4.2 Registro do dia

| Elemento | Destino | Regra |
|---|---|---|
| Acesso principal | Hoje → Registrar meu dia | permanece visível |
| Botão `Dia` da barra antiga | Hoje → Registrar meu dia | retirado somente da barra final |
| Tela e formulário do registro | Registrar meu dia | permanecem no HTML e funcionais |
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
| Situação semanal | Histórico → Análise → Semana atual | disponível |

### 4.4 Planejar

| Elemento | Destino | Estado |
|---|---|---|
| Acesso principal | barra inferior → Planejar | disponível |
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
| Tela antiga Ajustes | fallback interno | preservada, mas não ocupa a barra final |

Ao abrir Planejar diretamente pela barra, não existe botão Voltar porque a área é principal. Ao abrir pelo atalho de Hoje, o botão Voltar aparece e retorna para Hoje.

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
| Navegação inferior | Hoje, Histórico, Planejar, Mais | implementada no Bloco 1D |
| Botão voltar | telas secundárias | preserva origem e formulário |
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

**Estado:** concluído, aprovado pela CI e pelo GitHub Pages e validado fisicamente em 2026-08-04.

- Hoje mantém resumo diário, Registro do dia, situação mensal e leitura do VETTA;
- objetivo mensal e agenda aparecem em Planejar;
- semana aparece em Histórico → Análise;
- gráfico e detalhamento aparecem em Planejar;
- retirada reversível e condicionada à existência dos destinos;
- dados, cálculos e PWA preservados.

### Bloco 1D — Ativar navegação final

**Estado:** implementado, aprovado pela CI e pelo GitHub Pages; aguardando validação física.

Entregas executadas:

- a barra possui estruturalmente quatro áreas: `Hoje | Histórico | Planejar | Mais`;
- o botão `Dia` saiu somente da barra;
- `Registrar meu dia`, a tela e o formulário continuam acessíveis por Hoje;
- Ajustes saiu da barra porque Planejar passou a ser a área principal;
- rotas antigas de Ajustes convergem para Planejar;
- o botão Voltar distingue Planejar aberto diretamente de Planejar aberto pelo atalho de Hoje;
- o formulário não salvo permanece preenchido ao voltar;
- a navegação antiga é preservada se algum destino validado não carregar;
- nenhuma fórmula, dado, armazenamento ou arquivo do PWA foi alterado.

Aceite técnico alcançado:

- testes determinísticos aprovados;
- Chromium, Firefox e WebKit aprovados;
- interação, voltar e formulário não salvo aprovados;
- GitHub Pages com arquivos e interação aprovados;
- exatamente quatro itens reais comprovados na barra.

Aceite pendente:

- validação física da navegação no celular.

### Bloco 2 — Registro diário

**Estado:** não autorizado.

Direção prevista:

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

- Blocos 1A, 1B e 1C concluídos e validados fisicamente;
- Bloco 1D aprovado tecnicamente e publicado no GitHub Pages;
- navegação final possui `Hoje | Histórico | Planejar | Mais`;
- Registro do dia continua acessível em Hoje;
- Planejar é uma área principal;
- Hoje, Histórico, Planejar e Mais preservam seus conteúdos aprovados;
- `app.js`, `styles.css`, cálculos, dados e PWA permanecem intocados pelo Bloco 1D;
- Bloco 1D permanece **aguardando validação física**;
- Bloco 2 não está autorizado.

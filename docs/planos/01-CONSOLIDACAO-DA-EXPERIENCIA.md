# Plano 01 — Consolidação da experiência

**Estado:** ATIVO — replanejado após regressão de acesso  
**Atualizado em:** 2026-08-03  
**Branch de desenvolvimento:** `netlify/teste-fechado-ux`  
**Ambiente de validação:** GitHub Pages  
**Princípio:** simplificar sem apagar, esconder ou perder recursos

## 1. Objetivo

Reorganizar o CalculaAê para que o motorista encontre rapidamente o que precisa, sem perder recursos, cálculos, dados ou caminhos de acesso.

Navegação-alvo:

```text
Hoje | Histórico | Planejar | Mais
```

`Registrar meu dia` continua como ação destacada e acessível, mas não ocupa uma quinta aba.

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

- **permanece visível**;
- **muda de área com caminho visível**;
- **fica recolhido, mas com botão ou resumo visível**;
- **é substituído por solução equivalente ou melhor, após autorização específica**;
- **é removido permanentemente, após autorização explícita citando o item**.

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

## 4. Mapa completo dos elementos atuais

### 4.1 Tela Início atual → área Hoje

| Elemento atual | Destino aprovado | Forma de acesso | Situação no futuro |
|---|---|---|---|
| Meta de faturamento por dia | Hoje, primeiro cartão | visível ao abrir | permanece visível |
| Líquido planejado | Hoje, dentro do resumo principal | visível | permanece visível |
| Rodagem estimada | Hoje, dentro do resumo principal | visível | permanece visível |
| Preço/custo de combustível por km | Hoje, resumo compacto; edição em Planejar | visível no resumo | não some |
| Texto de situação da meta | Hoje | visível | permanece |
| Registrar meu dia | Hoje, ação principal fixa após o resumo | botão visível | permanece sempre acessível |
| Objetivo mensal líquido | Planejar → Metas | resumo visível; edição ao abrir | sai de Hoje somente depois de existir em Planejar |
| Seletor 5, 6 ou 7 dias | Planejar → Agenda | controle visível ao editar | não pode ser ocultado antes da realocação |
| Folgas extras | Planejar → Agenda | resumo e edição | permanece acessível |
| Situação do mês | Hoje, segundo bloco | visível | permanece |
| Progresso do mês | Hoje | visível | permanece |
| Líquido gerado | Hoje | visível | permanece |
| Projeção | Hoje | visível | permanece |
| Dias restantes | Hoje | visível | permanece |
| Situação da semana | Histórico → Análise semanal | atalho visível em Hoje ou aba Análise | só sai de Hoje quando o destino existir |
| Meta, realizado e média/km da semana | Histórico → Análise semanal | tela ou seção visível | não fica inacessível |
| Gráfico de pizza Distribuição da meta | Planejar → Distribuição da meta | cartão visível em Planejar | obrigatório; não pode ser ocultado |
| Faturamento bruto necessário | Planejar → Distribuição da meta | junto ao gráfico | permanece |
| Rodagem mensal estimada | Planejar → Distribuição da meta | junto ao gráfico | permanece |
| Combustível | Planejar → Distribuição da meta | junto ao gráfico | permanece |
| Custos por km | Planejar → Distribuição da meta | junto ao gráfico | permanece |
| Taxas percentuais | Planejar → Distribuição da meta | junto ao gráfico | permanece |
| Obrigações e reservas | Planejar → Distribuição da meta | junto ao gráfico | permanece |
| Objetivo líquido | Planejar → Distribuição da meta | junto ao gráfico | permanece |
| Leitura do VETTA | Hoje, terceiro bloco | visível | permanece |
| Razões da recomendação | Hoje, recolhíveis sob a leitura | botão ou expansão visível | não podem desaparecer |
| Ver planejamento do mês | Hoje, atalho para Planejar | botão visível até a navegação consolidada | só pode sair quando Planejar estiver acessível pela barra |

### 4.2 Registro do dia

| Elemento | Destino | Forma de acesso | Situação |
|---|---|---|---|
| Data | Registrar meu dia | visível e preenchida | permanece |
| Faturamento | Registrar meu dia | visível | permanece |
| Quilômetros | Registrar meu dia | visível | permanece |
| Horas online | Registrar meu dia → Opcionais | seção recolhível visível | não é removido |
| Combustível gasto | Registrar meu dia → Opcionais | seção recolhível visível | não é removido |
| Prévia bruto/custos/líquido | Registrar meu dia | visível antes de salvar | permanece |
| Salvar | Registrar meu dia | ação principal | permanece |
| Limpar | Registrar meu dia | ação secundária | permanece |

### 4.3 Histórico

| Elemento | Destino | Forma de acesso | Situação |
|---|---|---|---|
| Lista de dias | Histórico → Dias | primeira área | permanece |
| Editar dia | Histórico → Dias | ação no registro | permanece |
| Excluir dia | Histórico → Dias | ação com confirmação | permanece |
| Quantidade de dias | Histórico → Resumo | visível | permanece |
| Média de faturamento/km | Histórico → Resumo | visível | permanece |
| Líquido acumulado | Histórico → Resumo | visível | permanece |
| Gráfico de evolução | Histórico → Análise | aba ou seção visível | permanece |
| Comparação entre dias | Histórico → Análise | aba ou seção visível | permanece |
| Situação semanal | Histórico → Análise semanal | aba ou seção visível | recebe o conteúdo semanal de Hoje |

### 4.4 Ajustes atuais → Planejar

| Elemento | Destino | Forma de acesso | Situação |
|---|---|---|---|
| Objetivo líquido | Planejar → Metas | resumo + editar | permanece |
| Dias da semana | Planejar → Agenda | resumo + editar | permanece |
| Folgas extras | Planejar → Agenda | resumo + editar | permanece |
| Tipo de combustível | Planejar → Combustível | resumo + editar | permanece |
| Nome, preço e rendimento | Planejar → Combustível | editar | permanece |
| Receita média por km | Planejar → Operação | editar | permanece |
| Custos mensais | Planejar → Custos | lista | permanece |
| Custos semanais | Planejar → Custos | lista | permanece |
| Custos únicos | Planejar → Custos | lista | permanece |
| Custos por km | Planejar → Custos | lista | permanece |
| Custos percentuais | Planejar → Custos | lista | permanece |
| Reservas | Planejar → Custos e reservas | lista | permanece |
| Aprendizado local | Planejar → Aprendizado | resumo e confirmação | permanece |
| Restaurar padrões | Planejar → Opções avançadas | ação protegida | permanece |
| Gráfico de pizza | Planejar → Distribuição da meta | cartão visível | entra obrigatoriamente neste bloco |

### 4.5 Mais

| Elemento | Destino | Forma de acesso | Situação |
|---|---|---|---|
| Comparação Gasolina × GNV | Mais → Ferramentas | item visível | permanece |
| Relatório mensal | Mais → Relatórios | item visível | permanece |
| Exportar dados | Mais → Dados | item visível | permanece |
| Importar dados | Mais → Dados | item visível | permanece |
| Radar de eventos | Mais → Radar | item visível | permanece |
| Criar, editar e excluir evento | Mais → Radar | ações visíveis | permanecem |
| Instalação | Mais → Aplicativo | item visível | permanece |
| Versão do app | Mais → Aplicativo | informação visível | permanece |

### 4.6 Elementos globais

| Elemento | Destino | Regra |
|---|---|---|
| Cabeçalho VETTA | todas as áreas principais | permanece |
| Botão Instalar | Mais → Aplicativo; pode existir alerta global quando necessário | não pode sumir sem substituição clara |
| Navegação inferior | Hoje, Histórico, Planejar, Mais | quatro áreas após realocação completa |
| Botão voltar | telas secundárias | preserva origem e formulário |
| Modais de custo, evento e instalação | suas áreas correspondentes | permanecem funcionais |
| Onboarding | fluxo inicial | tratado no Bloco 6 |

## 5. Ordem correta de execução

A navegação de quatro áreas só pode ser ativada depois que todos os destinos necessários existirem.

### Bloco 1A — Construir Planejar sem retirar nada de Hoje

Entregas:

- criar a área Planejar completa;
- levar para ela meta, agenda, folgas, combustível, receita/km, custos, reservas e aprendizado;
- incluir o gráfico de pizza e todos os números da distribuição da meta;
- manter temporariamente os elementos originais em Hoje enquanto o novo destino é validado.

Aceite:

- todo conteúdo de Planejar funciona;
- gráfico de pizza visível;
- nenhum conteúdo anterior desapareceu;
- cálculos idênticos;
- validação no celular.

### Bloco 1B — Construir Histórico com Dias e Análise

Entregas:

- separar Dias e Análise;
- mover situação semanal, gráfico de evolução, médias e comparações para Análise;
- manter lista e correção de registros em Dias.

Aceite:

- todos os gráficos e análises possuem acesso visível;
- editar e excluir continuam funcionando;
- validação no celular.

### Bloco 1C — Consolidar Hoje

Somente após 1A e 1B aprovados:

- manter em Hoje o resumo diário;
- manter Registrar meu dia;
- manter progresso mensal;
- manter leitura do VETTA;
- retirar duplicações que já existam e estejam comprovadamente acessíveis em Planejar ou Histórico.

Para cada retirada, o relatório deve citar o destino já validado.

### Bloco 1D — Ativar navegação final

- trocar `Início | Dia | Histórico | Ajustes | Mais` por `Hoje | Histórico | Planejar | Mais`;
- retirar Dia da barra apenas porque Registrar meu dia já está validado em Hoje;
- verificar botão voltar, estado ativo e preservação do formulário.

### Bloco 2 — Registro diário

- priorizar faturamento e quilômetros;
- recolher opcionais sem removê-los;
- aprimorar prévia e confirmação;
- preservar edição e um registro por data.

### Blocos 3 a 8

Após a consolidação estrutural:

- Bloco 3: refinamento de Planejar;
- Bloco 4: refinamento de Histórico;
- Bloco 5: organização de Mais;
- Bloco 6: onboarding e linguagem;
- Bloco 7: acessibilidade e acabamento;
- Bloco 8: regressão completa e versão candidata.

Esses blocos não podem ser usados como promessa vaga de restaurar algo removido antes. Todo recurso deve continuar acessível durante cada transição.

## 6. Critério obrigatório para cada contrato futuro

Antes de qualquer alteração de interface, apresentar uma tabela:

| Elemento | Estado atual | Mudança | Destino | Como acessar | Pode ficar oculto? | Teste |
|---|---|---|---|---|---|---|

O contrato falha e não pode ser executado se algum elemento afetado não estiver nessa tabela.

## 7. Testes mínimos por bloco

- inventário automático dos elementos antes e depois;
- prova de que nenhum ID funcional desapareceu sem substituição;
- navegação e botão voltar;
- preservação do formulário não salvo;
- cálculos determinísticos independentes da interface;
- dados antigos carregando;
- criação, edição e exclusão aplicáveis;
- validação física no Android.

## 8. Estado atual

- a tentativa anterior do Bloco 1 foi revertida;
- a interface da branch UX voltou ao estado anterior;
- o gráfico de pizza e os demais cartões voltaram a ser visíveis;
- a branch UX continua separada para desenvolvimento;
- o próximo trabalho de interface deve começar pelo **Bloco 1A — construir Planejar sem retirar nada de Hoje**;
- este plano não autoriza executar o Bloco 1A automaticamente.

# Plano 01 — Consolidação da experiência

**Estado:** ATIVO — Blocos 1A a 4 validados fisicamente; Bloco 5 aprovado tecnicamente e **aguardando validação física**  
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
- fica recolhido com botão ou resumo visível;
- é substituído por solução equivalente ou melhor após autorização específica;
- é removido permanentemente após autorização explícita citando o item.

Ocultar por CSS sem destino visível é proibido.

## 3. Proteções permanentes

Este plano não altera:

- fórmulas financeiras;
- significado ou formato dos dados;
- registros, custos, eventos, fechamentos e configurações salvas;
- chave `vetta-driver-intelligence-v3`;
- funcionamento local-first;
- PWA, manifesto, service worker, cache ou acesso;
- identidade visual aprovada;
- `main`;
- branch estável e Netlify dos testadores.

## 4. Mapa completo dos elementos

### 4.1 Hoje

| Elemento | Destino permanente | Estado |
|---|---|---|
| Meta de faturamento por dia | Hoje | visível |
| Líquido planejado | Hoje | visível |
| Rodagem estimada | Hoje | visível |
| Custo de combustível por km | Hoje; edição em Planejar | visível |
| Texto de situação da meta | Hoje | visível |
| Registrar meu dia | Hoje → Registro | ação destacada |
| Situação, progresso e projeção do mês | Hoje | visíveis |
| Líquido gerado e dias restantes | Hoje | visíveis |
| Leitura e razões do VETTA | Hoje | visíveis quando aplicáveis |
| Ver planejamento do mês | Hoje → Planejar | atalho visível com retorno |
| Objetivo, dias e folgas | Planejar | retirados visualmente de Hoje após destino confirmado |
| Situação semanal | Histórico → Semana atual | retirado visualmente de Hoje após destino confirmado |
| Distribuição detalhada | Planejar → Distribuição | retirado visualmente de Hoje após destino confirmado |

As origens antigas permanecem no HTML como fallback para consumidores atuais. Só ficam ocultas depois que os destinos são confirmados.

### 4.2 Registro do dia

| Elemento | Destino | Estado |
|---|---|---|
| Data, faturamento e quilômetros | Registro | essenciais e visíveis |
| Horas e combustível | Detalhes opcionais | acessíveis sob demanda |
| Custos, líquido, receita/km e diferença da meta | Resultado antes de salvar | visíveis |
| Salvar e limpar | Registro | preservados |
| Confirmação após salvar | Registro concluído | preservada |
| Editar a mesma data | Registro e Histórico | atualiza sem duplicar |
| Concluir | Registro concluído → Hoje | retorno previsível |

A regra canônica continua sendo um registro por data e uma única fonte persistida.

### 4.3 Histórico

Histórico abre como resumo curto com quatro ilhas.

| Elemento | Destino | Estado após Bloco 4 |
|---|---|---|
| Lista, editar e excluir | Histórico → Dias registrados | tela própria |
| Quantidade de dias, média/km e líquido | Histórico → Resumo e evolução | tela própria |
| Gráfico de evolução | Histórico → Resumo e evolução | tela própria |
| Situação, meta, realizado e média/km semanais | Histórico → Semana atual | tela própria |
| Comparação entre dias | Histórico → Comparação | tela própria |
| Abas antigas Dias e Análise | fallback interno | preservadas |

Regras:

- `Voltar para Histórico` e o botão Voltar do Android retornam ao resumo;
- tocar novamente em Histórico também retorna ao resumo;
- editar e excluir continuam atuando sobre o mesmo registro;
- se faltar qualquer elemento obrigatório, o Bloco 4 não ativa.

### 4.4 Planejar

Planejar abre como resumo curto com sete ilhas.

| Elemento | Destino | Estado após Bloco 3 |
|---|---|---|
| Objetivo líquido | Planejar → Metas | tela própria |
| Dias e folgas | Planejar → Agenda | tela própria |
| Combustível e receita média/km | Planejar → Operação | tela própria |
| Custos e reservas | Planejar → Custos e reservas | tela própria |
| Gráfico e detalhamento | Planejar → Distribuição | tela própria |
| Aprendizado local | Planejar → Aprendizado | tela própria |
| Restaurar padrões | Planejar → Opções avançadas | tela própria e protegida |
| Ajustes antigo | fallback interno | preservado |

Regras:

- `Voltar para Planejar` e o botão Voltar do Android retornam ao resumo;
- Planejar aberto por Hoje mantém retorno para Hoje;
- valores permanecem ao alternar entre assuntos;
- se faltar qualquer seção obrigatória, a tela longa anterior permanece.

### 4.5 Mais

Mais abre como resumo curto com cinco ilhas.

| Elemento | Destino | Estado após Bloco 5 |
|---|---|---|
| Comparação Gasolina × GNV | Mais → Ferramentas | tela própria com campos, gráfico e ações originais |
| Relatório mensal | Mais → Relatórios | tela própria com fluxo original |
| Exportar e importar | Mais → Meus dados | tela própria e mesma fonte local |
| Lista, criar, editar e excluir evento | Mais → Radar | tela própria |
| Instalação e modal | Mais → Aplicativo | tela própria |
| Versão do aplicativo | Mais → Aplicativo | etiqueta original única |
| Rolagem antiga de Mais | fallback interno | preservada caso falte um destino |

Regras:

- `Voltar para Mais` e o botão Voltar do Android retornam ao resumo;
- tocar novamente em Mais enquanto uma área está aberta retorna ao resumo;
- os resumos acompanham o estado atual sem criar persistência nova;
- nenhum recurso ativa parcialmente: importação, lista do Radar e versão são requisitos do fallback;
- a etiqueta de versão original é reutilizada, sem cópia com o mesmo identificador.

### 4.6 Elementos globais

| Elemento | Destino | Regra |
|---|---|---|
| Cabeçalho VETTA | áreas principais | permanece |
| Botão Instalar | Mais → Aplicativo; pode existir alerta global | não retirar sem substituição |
| Navegação inferior | Hoje, Histórico, Planejar, Mais | implementada e validada |
| Botão voltar | telas secundárias | preserva origem e formulário |
| Modais de custo, evento e instalação | áreas correspondentes | permanecem |
| Onboarding | fluxo inicial | reservado ao Bloco 6 |

## 5. Ordem de execução

### Blocos 1A a 1D — Fundação da navegação

**Estado:** concluídos, aprovados pela CI e validados fisicamente em 2026-08-04.

Entregaram Planejar, Histórico inicial, Hoje consolidado e a barra final `Hoje | Histórico | Planejar | Mais`.

### Bloco 2 — Registro diário

**Estado:** concluído, aprovado pela CI e pelo GitHub Pages e validado fisicamente em 2026-08-04.

Priorizou faturamento e quilômetros, preservou detalhes opcionais, confirmação, edição da mesma data e retorno para Hoje.

### Bloco 3 — Refinar Planejar

**Estado:** concluído, aprovado pela CI e pelo GitHub Pages e validado fisicamente em 2026-08-04.

Entregou sete ilhas, telas próprias, mesmos campos e ações, preservação de valores, gráfico redesenhado e fallback da tela longa.

### Bloco 4 — Refinar Histórico

**Estado:** concluído, aprovado pela CI e pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

Entregou quatro ilhas, mesmos registros e cálculos, lista, edição, exclusão, gráfico, semana, comparação, retornos e fallback `Dias | Análise`.

### Bloco 5 — Organizar Mais

**Estado:** implementado, aprovado pela CI e pelo GitHub Pages; **aguardando validação física**.

Entregas:

- Mais abre como resumo curto;
- cinco ilhas visíveis: Ferramentas, Relatórios, Meus dados, Radar e Aplicativo;
- cada ilha abre uma tela própria;
- comparação, relatório, exportação, importação, eventos, instalação e versão usam os recursos originais;
- não existe segunda fonte de dados;
- a versão original permanece única;
- retorno por botão, Android e histórico do navegador;
- fallback preserva a rolagem anterior caso qualquer recurso obrigatório falte;
- nenhum cálculo, formato de dado, chave de armazenamento ou arquivo do PWA foi alterado.

Aceite técnico funcional alcançado na fotografia `848493889483720aa988f19b185eed02116feb3a`, execução `30947977950`:

- governança e testes determinísticos;
- Chromium;
- Firefox;
- WebKit;
- todos os cinco destinos e suas interações;
- importação e exportação na mesma fonte local;
- criação, edição e exclusão no Radar;
- instalação e versão única;
- preservação dos blocos anteriores;
- paridade dos arquivos públicos;
- interação no GitHub Pages.

Aceite físico ainda pendente no celular.

### Blocos 6 a 8

- Bloco 6: onboarding e linguagem;
- Bloco 7: acessibilidade e acabamento;
- Bloco 8: regressão completa e versão candidata.

**Estado:** não autorizados.

## 6. Critério obrigatório para contratos futuros

Antes de qualquer alteração de interface, apresentar:

| Elemento | Estado atual | Mudança | Destino | Como acessar | Pode ficar oculto? | Teste |
|---|---|---|---|---|---|---|

O contrato falha se algum elemento afetado não estiver inventariado.

## 7. Testes mínimos por bloco

- inventário antes e depois;
- prova de que nenhum recurso desapareceu sem destino;
- navegação e botão Voltar;
- preservação de formulários e dados;
- cálculos determinísticos;
- dados antigos carregando;
- criação, edição e exclusão aplicáveis;
- Chromium, Firefox e WebKit para interface;
- prova do ambiente publicado;
- validação física no Android.

## 8. Estado atual

- Blocos 1A a 4 concluídos e validados fisicamente;
- Bloco 5 aprovado tecnicamente e publicado automaticamente no ambiente de validação;
- Bloco 5 permanece **aguardando validação física**;
- `app.js`, fórmulas, formato dos dados, armazenamento local e PWA permanecem protegidos;
- Bloco 6 não está autorizado.

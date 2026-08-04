# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-04, horário de Brasília  
**Estado:** Bloco 1C — Hoje consolidado, aprovado pela CI e pelo GitHub Pages; aguardando validação física no celular.  
**Alteração em curso:** validação manual da tela Hoje consolidada.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional testada | `a73d8807849a903dc1faa442d9eb1afb1a778d99` |
| Execução automática final | `30907975939` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Blocos anteriores

### Bloco 1A — Planejar

Concluído, aprovado pela CI e validado fisicamente no celular.

Planejar reúne meta, agenda, combustível, custos, reservas, gráfico de pizza, aprendizado e opções avançadas usando a mesma fonte de dados do aplicativo.

### Bloco 1B — Histórico com Dias e Análise

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

Histórico abre em `Dias` e oferece `Análise` com resumo, gráfico, comparação e situação semanal.

## Bloco 1C — Consolidar Hoje

A tela Início foi reduzida ao conteúdo de uso diário.

### Permanece visível em Hoje

- meta de faturamento por dia;
- líquido planejado;
- rodagem estimada;
- custo de combustível por quilômetro;
- texto de situação da meta;
- botão `Registrar meu dia`;
- situação e progresso do mês;
- líquido gerado;
- projeção;
- dias restantes;
- leitura do VETTA e suas razões;
- botão `Ver planejamento do mês`.

### Duplicações retiradas de Hoje

| Elemento | Destino validado |
|---|---|
| objetivo mensal, seletor 5/6/7 dias e folgas | Planejar → Metas e Agenda |
| situação, meta, realizado e média por km da semana | Histórico → Análise → Semana atual |
| gráfico de pizza e detalhamento da distribuição | Planejar → Distribuição da meta |

Os cartões antigos permanecem no HTML como retorno seguro porque `app.js` continua atualizando seus identificadores. Eles são ocultados por atributo nativo somente depois que todos os destinos são encontrados.

Se Planejar, Histórico ou alguma origem necessária não carregar, o Bloco 1C não é aplicado e Início permanece completo. Nenhum recurso fica sem acesso.

## Navegação durante a transição

A navegação continua:

```text
Início | Dia | Histórico | Ajustes | Mais
```

O botão para Planejar permanece visível em Início. A navegação final de quatro áreas pertence exclusivamente ao Bloco 1D, que não está autorizado.

## Arquivos funcionais

- `today-1c.js`: consolida Hoje somente depois de confirmar todos os destinos;
- `history-1b.js`: carrega o módulo do Bloco 1C após Planejar e Histórico;
- `ci/branch-policy.json`: inclui `today-1c.js` na prova de paridade publicada.

## Testes adicionados e ajustados

- `tests/today-block-1c-contract.test.mjs`:
  - exige a permanência dos elementos essenciais de Hoje;
  - exige destinos válidos antes de qualquer retirada;
  - impede remoção física, CSS específico, alteração de dados e armazenamento;
  - preserva a chave `vetta-driver-intelligence-v3`.

- `tests/e2e/today-block-1c.spec.js`:
  - confirma Hoje mais curto e os elementos essenciais visíveis;
  - confirma as três duplicações ocultas e seus destinos registrados;
  - abre Planejar e Histórico para provar que os recursos continuam acessíveis;
  - preserva a navegação de cinco itens;
  - compara integralmente os dados financeiros e de uso antes e depois.

- `tests/e2e-remote/today-block-1c-published.spec.js`:
  - confirma `today-1c.js` servido pelo GitHub Pages;
  - valida Hoje, Planejar e Histórico no site publicado.

- testes dos Blocos 1A e 1B foram atualizados para o novo estado consolidado sem reduzir suas proteções.

## Evidência automática

Execução final: `30907975939`.

A execução verificou exatamente a fotografia funcional `a73d8807849a903dc1faa442d9eb1afb1a778d99` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes Node;
- Chromium;
- Firefox;
- WebKit;
- paridade dos arquivos públicos com o GitHub Pages, incluindo `today-1c.js`;
- interação no próprio site publicado.

As falhas intermediárias foram classificadas como defeitos dos testes, não do produto. Elas envolviam seleção incorreta da navegação, preenchimento de progresso em 0%, recarga normal do PWA e metadados internos de migração. Nenhuma correção funcional foi feita para mascarar esses resultados.

## Proteções confirmadas

Não foram alterados pelo Bloco 1C:

- `app.js` e as fórmulas financeiras;
- `styles.css`;
- formato e chave dos dados locais;
- registros, custos, eventos, fechamentos, importação e exportação;
- manifesto, service worker, cache, instalação e acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main`;
- PR #1.

## Aprendizado

**Aprendizado fechado:** testes de armazenamento durante a abertura de um PWA devem esperar a interface ficar pronta, tolerar a recarga normal do service worker e separar dados de negócio de metadados internos de migração.

Registro completo: `docs/incidents/INC-0005-comparacao-de-dados-durante-abertura-pwa.md`.

Prevenção executável: `tests/e2e/today-block-1c.spec.js`.

## Validação física pendente

O Bloco 1C permanece **aguardando validação física**.

No celular, validar:

1. Início ficou mais curto;
2. meta diária, mês, Registrar meu dia e leitura do VETTA continuam visíveis;
3. objetivo mensal, semana e gráfico de pizza não aparecem mais em Início;
4. `Ver planejamento do mês` continua abrindo Planejar;
5. Planejar mantém meta, agenda e gráfico de pizza;
6. Histórico → Análise mantém a situação semanal;
7. a navegação continua com cinco itens;
8. não existem cortes, sobreposições, travamentos ou perda de dados.

## Próximo passo único

O proprietário deve validar o Bloco 1C no celular pelo GitHub Pages. O Bloco 1D — navegação final — não está autorizado.

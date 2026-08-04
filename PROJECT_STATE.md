# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-04, horário de Brasília  
**Estado:** Blocos 1A a 3 validados fisicamente; Bloco 4 não autorizado.  
**Alteração em curso:** nenhuma alteração funcional em curso.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional do Bloco 3 | `0c6f7b3d57ff94cbd4681f6d6323703861c6233b` |
| Execução automática funcional | `30927631513` |
| Execução automática integral de fechamento | `30929247436` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Blocos validados fisicamente

### Bloco 1A — Planejar

Concluído, aprovado pela CI e validado fisicamente no celular.

### Bloco 1B — Histórico com Dias e Análise

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

### Bloco 1C — Consolidar Hoje

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

### Bloco 1D — Navegação final

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

### Bloco 2 — Registro diário

Concluído, aprovado pela CI e pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

O fluxo mantém faturamento e quilômetros como essenciais, preserva horas e combustível em detalhes opcionais, confirma o salvamento e atualiza a mesma data sem duplicação.

### Bloco 3 — Refinamento de Planejar

Concluído, aprovado pela CI e pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

O proprietário informou que o Planejar reorganizado foi validado no celular. A validação física encerra a pendência de interface do Bloco 3; ela não autoriza o Bloco 4 nem qualquer publicação em produção.

A barra permanece:

```text
Hoje | Histórico | Planejar | Mais
```

## Bloco 3 — comportamento entregue

Planejar deixou de ser uma rolagem única comprida e passou a abrir como um resumo curto, sem criar outra fonte de dados.

- resumo principal mostra a pergunta `O que você quer planejar?`;
- sete ilhas permanecem visíveis:
  - Metas;
  - Agenda;
  - Operação;
  - Custos e reservas;
  - Distribuição;
  - Aprendizado;
  - Opções avançadas;
- cada ilha abre uma tela própria;
- cada tela usa os mesmos campos, listas, gráfico e botões que já existiam;
- nenhum recurso foi apagado ou recriado em duplicidade;
- resumos das ilhas acompanham meta, dias, combustível, custos e projeção atuais;
- editar uma área e abrir outra preserva os valores;
- Distribuição redesenha o gráfico quando fica visível;
- `Voltar para Planejar` retorna ao resumo;
- o botão Voltar do Android ou navegador também retorna ao resumo;
- Planejar aberto pela barra continua sendo área principal;
- Planejar aberto pelo atalho de Hoje mantém o retorno para Hoje depois que o usuário volta ao resumo;
- se faltar qualquer elemento original obrigatório, o refinamento não ativa e a tela longa anterior permanece disponível.

## Arquivos funcionais e de proteção

- `planning-3.js`: cria o resumo e as telas por assunto, movendo os próprios elementos originais;
- `today-1c.js`: carrega `planning-3.js` antes do módulo de Registro;
- `ci/branch-policy.json`: inclui `planning-3.js` na prova do site publicado;
- `tests/planning-block-3-contract.test.mjs`: protege elementos, armazenamento, fallback e navegação;
- `tests/e2e/planning-block-3.spec.js`: testa ilhas, edição, custos, gráfico e retornos;
- `tests/e2e-remote/planning-block-3-published.spec.js`: prova o fluxo no GitHub Pages;
- testes anteriores de Planejar, Hoje, navegação e custos foram atualizados para abrir a ilha correta antes de acessar o mesmo recurso original.

## Evidência automática

A execução funcional `30927631513` verificou exatamente a fotografia `0c6f7b3d57ff94cbd4681f6d6323703861c6233b`.

A execução integral de fechamento `30929247436` verificou a fotografia documental `b9e9a29cbd8da55ed0f259b435bbb42a34ccfa24` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes Node;
- Chromium;
- Firefox;
- WebKit;
- sete ilhas e respectivas telas;
- edição de meta, agenda e combustível;
- cadastro e preservação de custos;
- gráfico de distribuição visível e atualizado;
- retorno por botão e histórico do navegador;
- atalho de Hoje com retorno previsível;
- paridade dos arquivos públicos com a branch;
- interação no próprio GitHub Pages.

## Aprendizado do bloco

**Nenhum aprendizado permanente novo.**

As primeiras falhas vieram de testes antigos que ainda esperavam a rolagem única. A correção foi atualizar os caminhos dos testes para reproduzir a nova navegação: abrir a ilha e então usar o mesmo elemento original. Nenhuma fórmula, dado ou comportamento financeiro foi alterado para fazer os testes passarem.

## Proteções confirmadas

Não foram alterados pelo Bloco 3:

- `app.js` e fórmulas financeiras;
- `styles.css`;
- chave `vetta-driver-intelligence-v3`;
- formato dos registros e demais dados locais;
- custos, eventos, fechamentos, importação e exportação;
- manifesto, service worker, cache, instalação e acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main`;
- PR #1.

## Validação física concluída

O Bloco 3 foi validado fisicamente pelo proprietário no celular em 2026-08-04.

Essa confirmação encerra a etapa de validação do Planejar reorganizado. Nenhuma nova alteração funcional foi incluída neste registro.

## Próximo passo único

Apurar e apresentar o contrato executável do Bloco 4 — refinamento de Histórico. A implementação do Bloco 4 ainda não está autorizada.

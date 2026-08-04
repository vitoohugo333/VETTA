# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-04, horário de Brasília  
**Estado:** Bloco 2 validado fisicamente; Bloco 3 — refinamento de Planejar aprovado tecnicamente e aguardando validação física.  
**Alteração em curso:** validação manual do Planejar organizado por assuntos.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional do Bloco 3 | `0c6f7b3d57ff94cbd4681f6d6323703861c6233b` |
| Execução automática funcional | `30927631513` |
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

A barra permanece:

```text
Hoje | Histórico | Planejar | Mais
```

## Bloco 3 — Refinamento de Planejar

Planejar deixou de ser uma rolagem única comprida e passou a abrir como um resumo curto, sem criar outra fonte de dados.

### Comportamento entregue

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

Execução funcional final: `30927631513`.

A execução verificou exatamente a fotografia `0c6f7b3d57ff94cbd4681f6d6323703861c6233b` e concluiu com sucesso:

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

Não houve novo defeito permanente do produto que exigisse incidente próprio.

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

## Validação física pendente

O Bloco 3 permanece **aguardando validação física**.

No celular, validar:

1. abrir Planejar pela barra inferior;
2. confirmar que a primeira tela é curta e mostra sete ilhas;
3. abrir Metas, editar o objetivo e voltar para Planejar;
4. confirmar que o resumo da ilha reflete a nova meta;
5. abrir Agenda e conferir dias da semana e folgas;
6. abrir Operação e conferir combustível e receita por km;
7. abrir Custos e reservas e conferir a lista e o botão de adicionar custo;
8. abrir Distribuição e confirmar gráfico e detalhamento;
9. abrir Aprendizado e Opções avançadas, sem executar restauração durante o teste;
10. dentro de uma ilha, usar o botão Voltar do Android e confirmar retorno ao resumo;
11. abrir Planejar pelo atalho de Hoje, entrar em uma ilha, voltar ao resumo e depois voltar para Hoje;
12. verificar cortes, sobreposições, travamentos e preservação dos valores.

## Próximo passo único

O proprietário deve validar o Bloco 3 no celular pelo GitHub Pages. O Bloco 4 — refinamento de Histórico — não está autorizado.

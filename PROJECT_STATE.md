# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-04, horário de Brasília  
**Estado:** Bloco 1D — navegação final implementada, aprovada pela CI e pelo GitHub Pages; aguardando validação física no celular.  
**Alteração em curso:** validação manual da barra `Hoje | Histórico | Planejar | Mais`.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional testada | `c49862ba473876d08967cb718b957279abd8fd70` |
| Execução automática funcional | `30913206515` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Blocos concluídos fisicamente

### Bloco 1A — Planejar

Concluído, aprovado pela CI e validado fisicamente no celular.

Planejar reúne meta, agenda, combustível, custos, reservas, gráfico de pizza, aprendizado e opções avançadas usando a mesma fonte de dados do aplicativo.

### Bloco 1B — Histórico com Dias e Análise

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

Histórico abre em `Dias` e oferece `Análise` com resumo, gráfico, comparação e situação semanal.

### Bloco 1C — Consolidar Hoje

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

Hoje mantém meta diária, registro, acompanhamento mensal e leitura do VETTA. Objetivo e distribuição permanecem em Planejar; a semana permanece em Histórico → Análise.

## Bloco 1D — Navegação final

A barra inferior foi consolidada em quatro áreas reais:

```text
Hoje | Histórico | Planejar | Mais
```

### Comportamento entregue

- `Início` passou a se chamar `Hoje`;
- o botão `Dia` saiu somente da barra inferior;
- `Registrar meu dia` continua visível em Hoje;
- a tela e o formulário de registro continuam preservados;
- ao abrir o registro, Hoje permanece como área principal ativa;
- `Ajustes` saiu da barra porque Planejar passou a ser uma área principal;
- a tela antiga de Ajustes permanece como fallback interno;
- rotas antigas de Ajustes convergem para Planejar;
- Planejar aberto diretamente pela barra não mostra Voltar;
- Planejar aberto pelo atalho de Hoje mostra Voltar e retorna para Hoje;
- o formulário não salvo continua preenchido depois de voltar;
- Histórico e Mais continuam como áreas principais;
- se algum destino validado não carregar, a navegação anterior é preservada.

## Arquivos funcionais e de proteção

- `today-1c.js`: mantém a consolidação de Hoje e ativa a navegação final somente depois de confirmar os destinos;
- `tests/navigation-block-1d-contract.test.mjs`: protege a estrutura real de quatro áreas e a permanência do registro;
- `tests/e2e/navigation-block-1d.spec.js`: testa barra, estado ativo, voltar e formulário não salvo;
- `tests/e2e-remote/navigation-block-1d-published.spec.js`: prova o mesmo comportamento no GitHub Pages;
- `tests/e2e/cost-modal.spec.js`: usa o caminho oficial de custos por Planejar;
- testes dos Blocos 1A e 1C foram atualizados para a navegação final sem reduzir suas proteções.

## Evidência automática

Execução funcional final: `30913206515`.

A execução verificou exatamente a fotografia `c49862ba473876d08967cb718b957279abd8fd70` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes Node;
- Chromium;
- Firefox;
- WebKit;
- exatamente quatro itens reais na barra;
- navegação entre as quatro áreas;
- abertura do Registro do dia por Hoje;
- preservação do formulário não salvo;
- comportamento do botão Voltar em Planejar;
- paridade dos arquivos públicos com o GitHub Pages;
- interação no próprio site publicado.

## Defeitos encontrados e resolvidos no bloco

### Botão Dia ainda visível

A primeira implementação usou o atributo `hidden`, mas o estilo existente da barra fez o botão continuar aparecendo. A solução correta foi retirar somente esse botão da barra depois de confirmar todos os destinos, mantendo a tela e o acesso por Hoje.

### Leitura durante recarga do PWA

Testes do WebKit e do site publicado faziam leitura instantânea dos nomes da barra durante uma recarga normal do PWA. Eles passaram a aguardar o estado esperado sem alterar o aplicativo.

Registro completo: `docs/incidents/INC-0006-hidden-sobrescrito-na-navegacao-final.md`.

## Proteções confirmadas

Não foram alterados pelo Bloco 1D:

- `app.js` e fórmulas financeiras;
- `styles.css`;
- chave e formato dos dados locais;
- registros, custos, eventos, fechamentos, importação e exportação;
- manifesto, service worker, cache, instalação e acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main`;
- PR #1.

## Validação física pendente

O Bloco 1D permanece **aguardando validação física**.

No celular, validar:

1. a barra mostra exatamente `Hoje | Histórico | Planejar | Mais`;
2. Hoje abre e fica destacado corretamente;
3. `Registrar meu dia` abre o formulário e mantém Hoje destacado;
4. preencher faturamento e quilômetros, voltar e abrir novamente preserva o rascunho;
5. Planejar pela barra abre sem botão Voltar;
6. `Ver planejamento do mês` em Hoje abre Planejar com botão Voltar;
7. Histórico e Mais abrem e ficam destacados;
8. não existem cortes, sobreposições, travamentos ou perda de dados.

## Próximo passo único

O proprietário deve validar o Bloco 1D no celular pelo GitHub Pages. O Bloco 2 — Registro diário — não está autorizado.

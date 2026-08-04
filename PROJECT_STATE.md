# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-04, horário de Brasília  
**Estado:** Blocos 1A a 3 validados fisicamente; Bloco 4 aprovado tecnicamente e aguardando validação física.  
**Alteração em curso:** validação manual do Histórico organizado por assuntos.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia integral do Bloco 4 | `3acafd3ebcf0fb51154d4dd8538c3ffa0f35de3f` |
| Execução automática integral | `30941963581` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Blocos validados fisicamente

- Bloco 1A — Planejar;
- Bloco 1B — Histórico com Dias e Análise;
- Bloco 1C — Consolidar Hoje;
- Bloco 1D — Navegação final;
- Bloco 2 — Registro diário;
- Bloco 3 — Refinamento de Planejar.

Todos foram validados pelo proprietário no celular. A barra permanece:

```text
Hoje | Histórico | Planejar | Mais
```

## Bloco 4 — Refinamento de Histórico

Histórico deixou de abrir como uma rolagem que misturava lista e análise. Agora abre como um resumo curto com quatro ilhas:

- Dias registrados;
- Resumo e evolução;
- Semana atual;
- Comparação.

### Comportamento entregue

- cada ilha abre uma tela própria;
- Dias registrados mantém lista, editar e excluir;
- Resumo e evolução mantém quantidade de dias, média por km, líquido e gráfico;
- Semana atual mantém situação, meta, realizado e média por km;
- Comparação mantém a análise entre dias;
- os mesmos elementos antigos foram movidos, sem segunda lista, segundo gráfico ou nova fonte de dados;
- o botão `Voltar para Histórico` retorna ao resumo curto;
- o botão Voltar do Android ou navegador também retorna ao resumo;
- tocar novamente em Histórico enquanto uma área está aberta retorna ao resumo;
- as abas antigas `Dias | Análise` continuam preservadas como fallback interno;
- se qualquer elemento obrigatório faltar, o Bloco 4 não ativa e o Histórico anterior permanece disponível;
- estados sem registros e com poucos registros continuam claros.

## Arquivos funcionais e de proteção

- `history-4.js`: cria o resumo e as quatro telas usando os elementos existentes;
- `today-1c.js`: carrega `history-4.js` pela cadeia de módulos já validada;
- `ci/branch-policy.json`: inclui `history-4.js` na prova do GitHub Pages;
- `tests/history-block-4-contract.test.mjs`: protege inventário, fallback, dados e navegação;
- `tests/e2e/history-block-4.spec.js`: testa as quatro áreas e seus estados;
- `tests/e2e-remote/history-block-4-published.spec.js`: prova o fluxo no GitHub Pages;
- testes anteriores de Histórico, Registro, Hoje e navegação foram adaptados ao caminho oficial do Bloco 4;
- testes antigos de Planejar e telas secundárias passaram a aguardar a estabilização normal da abertura PWA no Firefox.

## Evidência automática

A execução `30941963581` verificou exatamente a fotografia `3acafd3ebcf0fb51154d4dd8538c3ffa0f35de3f` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes Node;
- Chromium;
- Firefox;
- WebKit;
- quatro ilhas e respectivas telas;
- lista, edição e exclusão de registros;
- resumo, gráfico, semana e comparação;
- estados sem dados;
- navegação por botão e histórico do navegador;
- preservação dos cálculos semanais e do registro diário;
- paridade dos arquivos públicos com a branch;
- interação no próprio GitHub Pages.

## Falhas intermediárias classificadas

A primeira execução falhou porque o contrato estático exigia referência direta a campos internos, embora o módulo movesse corretamente o cartão inteiro. O teste foi corrigido sem alterar o aplicativo.

A segunda execução passou no Bloco 4, Chromium e WebKit, mas testes antigos perderam cliques durante a recarga normal do PWA no Firefox. Somente os auxiliares desses testes foram estabilizados. Nenhuma fórmula, dado ou comportamento financeiro foi alterado para obter resultado verde.

## Aprendizado do bloco

**Nenhum aprendizado permanente novo.**

A recarga durante a abertura do PWA já está documentada e protegida pelos incidentes e testes existentes. O Bloco 4 apenas aplicou a mesma prevenção em cenários antigos que ainda não aguardavam a tela observável.

## Proteções confirmadas

Não foram alterados pelo Bloco 4:

- `app.js` e fórmulas financeiras;
- `styles.css`;
- chave `vetta-driver-intelligence-v3`;
- formato de registros, custos, eventos e fechamentos;
- importação e exportação;
- manifesto, service worker, cache, instalação e acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main`;
- PR #1.

## Validação física pendente

O Bloco 4 permanece **aguardando validação física**.

No celular, validar:

1. abrir Histórico pela barra inferior;
2. confirmar que a primeira tela é curta e mostra quatro ilhas;
3. abrir Dias registrados e testar lista, Editar e Excluir com um registro descartável;
4. voltar para Histórico;
5. abrir Resumo e evolução e conferir os números e o gráfico;
6. abrir Semana atual e conferir meta, realizado e média por km;
7. abrir Comparação e conferir a explicação;
8. dentro de uma área, usar o botão Voltar do Android e confirmar retorno ao resumo;
9. verificar cortes, sobreposições, travamentos e preservação dos dados.

## Próximo passo único

O proprietário deve validar o Bloco 4 no celular pelo GitHub Pages. O Bloco 5 — organização de Mais — não está autorizado.

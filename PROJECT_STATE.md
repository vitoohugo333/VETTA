# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-03, horário de Brasília  
**Estado:** Bloco 1B — Histórico com `Dias | Análise` implementado, aprovado pela CI e pelo GitHub Pages; aguardando validação física no celular.  
**Alteração em curso:** validação manual da nova organização do Histórico.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional testada | `9d80641dad1427bea2131d6ae70838b5d50fd20f` |
| Execução automática final | `30871942011` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Bloco 1A — Planejar

O Bloco 1A permanece concluído e validado fisicamente.

Planejar reúne meta, agenda, combustível, custos, reservas, gráfico de pizza, aprendizado e opções avançadas, sem criar uma segunda fonte de dados. Início e Ajustes continuam preservados durante a transição.

## Bloco 1B — Histórico com Dias e Análise

Histórico foi dividido em duas áreas internas com acesso visível:

### Dias

- abre por padrão;
- mostra a quantidade de registros;
- mantém a lista do mais recente para o mais antigo;
- preserva data, faturamento, quilômetros, receita por quilômetro e líquido estimado;
- mantém editar e excluir com confirmação;
- mantém a mensagem quando não existem registros.

### Análise

- mostra quantidade de dias, média por quilômetro e líquido acumulado;
- preserva o gráfico `Evolução do líquido`;
- preserva a comparação entre dias;
- inclui a análise da semana atual;
- mostra meta, realizado, média por quilômetro e situação semanal;
- usa exatamente o mesmo cálculo semanal exibido em Início.

## Transição sem retirada

Durante o Bloco 1B:

- Início continua completo;
- o cartão semanal original permanece em Início;
- Ajustes continua completo;
- Planejar continua completo;
- a navegação permanece `Início | Dia | Histórico | Ajustes | Mais`;
- nenhum elemento existente foi removido ou ocultado permanentemente;
- nenhum novo campo foi gravado para guardar a aba selecionada;
- a chave `vetta-driver-intelligence-v3` e o formato dos dados permanecem intactos.

## Arquivos funcionais

- `history-1b.js`: organiza Histórico em Dias e Análise, reutilizando a lista, o gráfico, a comparação e o cálculo semanal existentes;
- `app-shell.html`: carrega `history-1b.js` depois de `app.js` e `planning-1a.js`;
- `ci/branch-policy.json`: inclui o novo módulo na prova dos arquivos publicados.

## Testes adicionados e ajustados

- `tests/history-block-1b-contract.test.mjs`:
  - exige os destinos Dias e Análise;
  - preserva a chave de armazenamento;
  - exige a permanência do cartão semanal original em Início;
  - impede IDs duplicados e novo estado persistido;
  - inclui `history-1b.js` na prova publicada.

- `tests/e2e/history-block-1b.spec.js`:
  - confirma que Histórico abre em Dias;
  - edita um registro sem duplicá-lo;
  - exclui somente o registro escolhido;
  - verifica o gráfico, os resumos e a comparação em Análise;
  - compara os seis valores da semana em Histórico com os mesmos valores de Início;
  - verifica os estados sem dados e com dados insuficientes.

- `tests/e2e-remote/history-block-1b-published.spec.js`:
  - confirma que `history-1b.js` está servido pelo GitHub Pages;
  - abre o aplicativo publicado;
  - alterna de Dias para Análise;
  - confirma o gráfico e a permanência do cartão semanal original.

## Evidência automática

Execução final: `30871942011`.

A execução verificou exatamente a fotografia funcional `9d80641dad1427bea2131d6ae70838b5d50fd20f` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes Node;
- Chromium;
- Firefox;
- WebKit;
- paridade dos arquivos públicos com o GitHub Pages, incluindo `history-1b.js`;
- testes de interação no próprio site publicado.

Uma execução anterior, `30871742095`, encontrou uma falha somente no teste do Firefox: o teste tocava em Histórico antes de o redirecionamento inicial terminar. A espera foi corrigida no teste, sem alteração no aplicativo, e a cobertura completa passou na execução final.

## Proteções confirmadas

Não foram alterados pelo Bloco 1B:

- `app.js` e as fórmulas financeiras;
- `styles.css`;
- `planning-1a.js`;
- registros, custos, eventos, importação e exportação;
- chave ou formato dos dados locais;
- manifesto, service worker, cache, instalação e acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main`;
- PR #1.

## Validação física pendente

O Bloco 1B permanece **aguardando validação física**.

No celular, validar:

1. abrir Histórico e confirmar que `Dias` aparece primeiro;
2. conferir a lista e os botões Editar e Excluir;
3. tocar em `Análise`;
4. conferir resumo, semana atual, gráfico e comparação;
5. alternar entre Dias e Análise algumas vezes;
6. confirmar ausência de cortes, sobreposições ou travamentos;
7. voltar para Início e confirmar que o cartão semanal continua presente;
8. confirmar que Planejar e Ajustes continuam completos.

## Aprendizado

**Nenhum aprendizado permanente novo.**

A falha intermediária aplicou uma regra já existente: testes de interface devem esperar um estado observável depois de navegação ou redirecionamento, especialmente no Firefox.

## Próximo passo único

O proprietário deve validar o Bloco 1B no celular pelo GitHub Pages. O Bloco 1C — Consolidar Hoje — não está autorizado e nenhuma duplicação poderá ser retirada antes dessa validação física e de um novo contrato explícito.

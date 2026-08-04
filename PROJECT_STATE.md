# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-03, horário de Brasília  
**Estado:** Bloco 1A — Planejar implementado e aprovado pela CI; aguardando validação física no celular.  
**Alteração em curso:** validação manual da nova área Planejar no GitHub Pages.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional testada | `7710f7db7be4485aab31bcbf96d51443d9f932a4` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Bloco 1A — Planejar

Foi construída uma área Planejar completa, acessada pelo botão `Ver planejamento do mês` existente em Início.

A área reúne:

- resumo do plano;
- objetivo mensal;
- agenda, dias específicos e folgas extras;
- operação e combustível;
- custos e reservas;
- gráfico de pizza `Distribuição da meta` e todos os valores associados;
- aprendizado local;
- restauração protegida dos parâmetros.

Todos os controles usam o mesmo estado, as mesmas funções e a mesma chave de dados já usados pelo aplicativo. Não foi criada uma segunda fonte de dados.

## Transição sem retirada

Durante o Bloco 1A:

- Início continua completo;
- Ajustes continua completo;
- o gráfico de pizza continua em Início e também aparece em Planejar;
- a navegação permanece `Início | Dia | Histórico | Ajustes | Mais`;
- nenhum elemento foi ocultado, removido ou recolhido no local original;
- a duplicação é temporária e só poderá ser retirada em bloco posterior após validação explícita do destino.

## Arquivos funcionais

- `planning-1a.js`: estrutura, renderização e interações da nova área Planejar;
- `app-shell.html`: carrega `planning-1a.js` depois do aplicativo principal;
- `ci/branch-policy.json`: inclui o novo módulo na prova de paridade do GitHub Pages.

## Testes adicionados e ajustados

- `tests/planning-block-1a-contract.test.mjs`:
  - preserva a chave `vetta-driver-intelligence-v3`;
  - exige o gráfico e os controles do Planejar;
  - exige que os elementos originais continuem presentes;
  - impede IDs de elementos duplicados;
  - impede ocultação ou remoção de Início e Ajustes pelo módulo.

- `tests/e2e/planning-block-1a.spec.js`:
  - abre Planejar e confere todos os destinos principais;
  - confirma o gráfico de pizza visível;
  - altera meta, agenda e combustível usando o mesmo estado;
  - cria exatamente um custo e confirma o mesmo item em Planejar e Ajustes;
  - volta para Início e confirma que os elementos originais continuam visíveis.

- `tests/e2e/cost-modal.spec.js`:
  - passou a esperar Ajustes ficar visível antes de abrir o modal de custos;
  - nenhuma lógica do aplicativo foi alterada por esse ajuste.

## Evidência automática

Execução final: `30867200539`.

A execução verificou exatamente a fotografia funcional `7710f7db7be4485aab31bcbf96d51443d9f932a4` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes Node;
- Chromium;
- Firefox;
- WebKit;
- comparação dos arquivos públicos com o GitHub Pages, incluindo `planning-1a.js`;
- testes de interação no próprio site publicado.

Duas falhas anteriores foram classificadas antes do fechamento:

1. um teste estático confundia `data-cost-id` com `id` de elemento; o teste foi corrigido;
2. uma execução concorrente foi cancelada enquanto instalava Firefox; a execução final sem concorrência passou integralmente.

## Proteções confirmadas

Não foram alterados:

- `app.js` e as fórmulas financeiras;
- chave ou formato dos dados locais;
- registros, eventos, importação e exportação;
- `styles.css`;
- manifesto, service worker, cache, instalação e acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main` como aplicativo;
- PR #1.

## Validação física pendente

O Bloco 1A permanece **aguardando validação física**.

No celular, validar:

1. abrir Início e tocar em `Ver planejamento do mês`;
2. conferir o resumo, Metas, Agenda, Operação e combustível, Custos e reservas, Distribuição da meta, Aprendizado e Opções avançadas;
3. conferir o gráfico de pizza visível;
4. alterar um valor simples e verificar a atualização no restante do aplicativo;
5. abrir e fechar as seções recolhíveis;
6. usar Voltar e confirmar retorno para Início;
7. confirmar ausência de cortes, sobreposições ou travamentos;
8. confirmar que Início e Ajustes continuam completos.

## Aprendizado

**Nenhum aprendizado permanente novo.**

O bloco aplicou regras já registradas: destino explícito antes de retirada, uma fonte única de dados, espera por estado observável nos testes e validação publicada independente da validação física.

## Próximo passo único

O proprietário deve validar o Bloco 1A no celular pelo GitHub Pages. Somente depois dessa confirmação o Bloco 1A pode ser encerrado e o contrato do Bloco 1B — Histórico com Dias e Análise — pode ser apresentado. Nenhuma retirada de conteúdo de Início ou Ajustes está autorizada por este estado.

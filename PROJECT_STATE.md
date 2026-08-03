# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03  
**Estado:** PWA validado no Android; Bloco 0 concluído; estratégia de branches definida.  
**Alteração em curso:** nenhuma no aplicativo; organização documental concluída e exclusão de três branches superadas pendente por limitação do conector GitHub.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch ativa de desenvolvimento e validação | `netlify/teste-fechado` |
| Site ligado à branch | `calculaae.netlify.app` |
| Fotografia funcional validada no Android | `0b3ff2da3ecad020abb2294dbb616df132b874ff` |
| Relatório do Bloco 0 | `docs/planos/01-BLOCO-0-REFERENCIA-E-PROTECAO-DA-BASE.md` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
| Branch histórica permanente | `migration/vetta-clean-3-5-1` |
| `main` | protegida e não alterada; `2a42c39612ec161bf58f16bbbbbd26521f28d30a` |

## Decisões explícitas do proprietário

- O desenvolvimento continuará na própria `netlify/teste-fechado`.
- Cada commit nessa branch pode atualizar automaticamente `calculaae.netlify.app`.
- `migration/vetta-clean-3-5-1` é uma referência histórica permanente e nunca deve ser excluída.
- A PR #1 deve permanecer aberta e intocada até nova decisão.
- Não será criada uma segunda credencial de acesso neste momento.
- `main`, cálculos, dados, PWA e interface permanecem fora desta organização de branches.

## Branches e PR — confirmação atual

Na checagem anterior à organização existiam seis branches remotas:

| Branch | Situação confirmada |
|---|---|
| `main` | produção protegida; permanece intocada |
| `netlify/teste-fechado` | branch ativa e mais nova |
| `migration/vetta-clean-3-5-1` | referência permanente; cabeça da PR #1 |
| `feature/bloco-1-navegacao-secundaria` | superada; totalmente contida na branch ativa; sem PR dependente |
| `tmp/pwa-gate-apply` | superada; totalmente contida na branch ativa; sem PR dependente |
| `tmp/pwa-gate-apply-2` | superada; totalmente contida na branch ativa; sem PR dependente |

As três branches autorizadas para exclusão apontam para a mesma fotografia antiga `f22159d2ef321b3ab268b7a1b8ecfeb5b8a0c62a`. A branch ativa está 61 fotografias salvas à frente e não está atrás delas.

A PR #1 continua aberta em rascunho, sem merge, com base em `main` e cabeça em `migration/vetta-clean-3-5-1`.

## Limitação operacional encontrada

O conector GitHub disponível nesta sessão permite pesquisar, comparar, criar e mover branches, mas não oferece uma ação de exclusão de branch.

Por isso:

- nenhuma exclusão foi simulada;
- nenhuma branch foi movida para outro commit;
- as três branches superadas continuam existindo até serem excluídas pela interface do GitHub ou por uma futura ação remota suportada;
- a regra permanente e a decisão do proprietário já foram registradas no `AGENTS.md`.

## Aplicativo e validação física

- O botão de instalação abriu a janela nativa do Android.
- O PWA foi instalado e abriu pelo ícone sem mostrar a tela de instalação.
- A validação física do PWA no Android está concluída.
- Nenhum arquivo funcional do aplicativo foi alterado nesta organização.
- O fluxo completo no iPhone/Safari continua não confirmado.

## Credenciais de acesso

- A configuração do Netlify preserva três credenciais sem expiração.
- A credencial adicionada usa a senha escolhida pelo proprietário; o identificador interno não é uma segunda senha.
- Nenhuma senha em texto está no repositório.
- Não será criada outra credencial neste momento.

## Bloco 0 — resultado

O Bloco 0 foi concluído como diagnóstico, referência e contrato. Foram registrados:

- telas e fluxos atuais;
- comportamentos de dados, cálculos, navegação, PWA e aparência que não podem regredir;
- testes existentes e lacunas;
- situação das branches e da PR;
- contrato proposto do Bloco 1.

Nenhum item do Bloco 1 foi implementado.

## Testes e lacunas antes do Bloco 1

- a branch de validação não possui CI automática associada a cada push;
- faltam testes determinísticos independentes da interface para todas as fórmulas financeiras;
- faltam coberturas completas de registros diários, importação, exportação, onboarding e recuperação de dados;
- o teste E2E do gate do PWA contém texto de uma versão anterior;
- `tests/README.md` cita um cache antigo;
- workflows de `main` ainda apontam para domínio e conjunto de arquivos antigos;
- dependências visuais externas precisam ser consideradas em testes offline;
- `app.js` possui camadas de compatibilidade que não podem ser refatoradas junto com a mudança visual.

## Aprendizado do bloco

**Aprendizado operacional fechado:** uma exclusão autorizada só pode ser declarada concluída quando a fonte remota confirmar a remoção. Ausência de ação no conector não autoriza simular a operação, mover a branch ou usar outro caminho sem transparência.

A proteção permanente da branch histórica está no `AGENTS.md`; este arquivo registra o estado atual e a pendência operacional.

## Próximo passo único — preparação do Bloco 1

Antes de modificar a interface, apresentar o contrato executável do **Bloco 1 — Navegação e tela Hoje**.

O contrato deve detalhar:

1. como a navegação mudará para `Hoje | Histórico | Planejar | Mais`;
2. onde ficará a ação `Registrar meu dia`;
3. quais elementos permanecerão na tela Hoje e quais serão movidos;
4. arquivos e testes afetados;
5. proteção dos cálculos, dados locais, PWA, acesso e `main`;
6. deploy automático em `calculaae.netlify.app`;
7. roteiro de validação física no Android.

Essa preparação não autoriza a implementação até o proprietário aprovar o contrato específico.

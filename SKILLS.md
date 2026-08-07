<!-- VETTA_GOVERNANCE_VERSION: 2026-08-07.4 -->
# VETTA — índice técnico obrigatório

Este arquivo é o mapa de leitura para qualquer agente. Ele deve ser lido depois de `AGENTS.md` e antes de `PROJECT_STATE.md`.

## Interface humana por blocos

O proprietário pode operar a memória do projeto com comandos simples:

- `Liste os blocos ativos do VETTA.`
- `Leia o bloco X e siga-o.`

Quando um bloco do Notion for citado, o agente deve tratá-lo como **roteador operacional**: localizar sozinho Central Oficial, Estado Oficial, Roadmap, decisões, aprendizados, códigos `N-xxx`, branch-alvo, fotografia, PR, CI, ambiente e regras técnicas relacionadas. O proprietário não deve ser obrigado a enumerar essas dependências.

O bloco não substitui a verdade técnica viva. Depois de resolver o contexto do Notion, o agente deve confirmar o estado atual no GitHub e nas demais fontes aplicáveis.

## Sequência obrigatória

1. bloco do Notion citado pelo proprietário, quando houver;
2. `AGENTS.md` — autoridade, escopo, fontes de verdade e forma de trabalhar;
3. `SKILLS.md` — este índice;
4. `TESTING_RULES.md` — responsabilidade autônoma por testes e CI Universal Adaptativa;
5. skill ou regra especializada aplicável;
6. `LEARNING_RULES.md` quando houver defeito, quase falha ou aprendizado;
7. `PROJECT_STATE.md` — estado atual da branch;
8. fontes vivas relevantes.

## Arquivos operacionais

| Área | Arquivo | Aplicação |
|---|---|---|
| UX de produto e fluxos mobile | `.skills/vetta-product-ux/SKILL.md` | obrigatória em diagnóstico, proposta, revisão ou mudança de experiência |
| Testes e CI | `TESTING_RULES.md` | `.github/workflows/ci-engine.yml`, `ci/branch-policy.json`, `scripts/ci/` |
| PWA, instalação, cache e acesso | `PWA_RULES.md` | testes PWA, Playwright e ambiente publicado |
| Aprendizado técnico | `LEARNING_RULES.md` | `docs/incidents/` |
| Operação prática dos testes | `tests/README.md` | testes descobertos na própria branch |
| Estado vivo | `PROJECT_STATE.md` | branch, commit, CI, deploy e validação física |
| Memória operacional | Notion — Central/Blocos/Decisões/Aprendizados | missão, contexto, autorizações, decisões e aprendizados; nunca substitui GitHub vivo |

## Regra de consistência entre branches

`AGENTS.md`, `SKILLS.md`, `TESTING_RULES.md`, `PWA_RULES.md`, `LEARNING_RULES.md` e `.skills/vetta-product-ux/SKILL.md` são canônicos na `main` e devem permanecer iguais nas branches operacionais.

`PROJECT_STATE.md`, planos, incidentes e `ci/branch-policy.json` refletem o estado específico de cada branch.

## Codex Engineering Guardrails — gate operacional contínuo

O **Codex Engineering Guardrails é obrigatório durante todo trabalho técnico do VETTA**, não apenas no preflight ou na primeira mensagem.

### Resolução obrigatória

O agente deve tentar primeiro usar o plugin **Codex Engineering Guardrails** como pacote normal de trabalho.

Falha de descoberta, catálogo, status de instalação ou carregamento automático do plugin **não prova indisponibilidade**. Se o plugin não puder ser carregado, o agente deve usar imediatamente a skill adequada:

- `code-verification` para diagnóstico, auditoria, revisão, testes e validação sem alteração de produção;
- `code-work` para qualquer mudança autorizada de código, configuração ou documentação técnica.

O agente decide qual skill é aplicável a partir da tarefa. O proprietário não precisa mencionar o nome da skill.

Somente declarar **Codex Engineering Guardrails indisponível** se o plugin e a skill diretamente aplicável não puderem ser carregados. O repositório público `Comdir2/Codex-engineering-guardrails` pode ser usado para referência e versionamento, mas não substitui a execução da skill quando ela está disponível.

### Gate por fase da operação

Antes de cada fronteira material do trabalho, o agente deve confirmar internamente que está operando sob o modo correto:

1. antes da primeira conclusão técnica de diagnóstico, auditoria ou revisão: `code-verification`;
2. antes da primeira alteração autorizada: `code-work`;
3. se uma tarefa mudar de somente leitura para mudança, carregar `code-work` **antes da primeira escrita**;
4. antes de declarar um checkpoint técnico encerrado, confirmar que o Guardrails aplicável cobriu a verificação final.

Não é necessário recarregar a mesma skill a cada comando ou commit se o modo de trabalho não mudou e a skill continua ativa no contexto. O objetivo é manter a disciplina, não criar chamadas redundantes.

### Se o agente perceber que começou sem Guardrails

Isso é um gatilho de recuperação, não motivo para continuar silenciosamente nem para descartar trabalho automaticamente.

O agente deve:

1. parar no próximo ponto seguro antes de nova alteração ou conclusão;
2. tentar o plugin; se ele falhar, carregar diretamente a skill correta;
3. reler o contrato, governança e limites aplicáveis;
4. revisar o trabalho feito desde o último ponto comprovadamente coberto pelo Guardrails — diff, decisões, testes, CI e efeitos externos relevantes;
5. tratar esse trecho anterior como **ainda não verificado pelo Guardrails** até concluir a revisão;
6. corrigir, testar ou classificar qualquer desvio encontrado dentro da autorização existente;
7. somente então continuar a operação normal.

Se plugin e skill aplicável falharem, o agente não deve iniciar nova alteração técnica nem declarar conclusão técnica. Deve informar a indisponibilidade de forma simples e registrar a pendência no checkpoint aplicável.

No relatório final, `Modo executado` deve indicar se o Guardrails foi usado pelo **plugin** ou pela **skill direta como fallback**.

**Rastreabilidade:** N-011 define plugin-primeiro/skill-fallback; N-013 torna o Guardrails um gate contínuo durante a operação.

## Sincronização contínua GitHub ↔ Notion

GitHub prova o estado técnico vivo; Notion preserva a memória operacional. O agente deve manter os dois coerentes **durante o trabalho**, sem esperar o fim de uma sessão longa e sem transformar documentação em gargalo.

Atualize o bloco correspondente no Notion sempre que ocorrer um **checkpoint relevante**, incluindo:

- resultado observável implementado;
- CI concluída, falha relevante classificada ou novo bloqueio;
- decisão, escopo ou autorização alterados;
- defeito relevante ou aprendizado reutilizável descoberto;
- fotografia importante da branch que passe a representar novo estado;
- validação física;
- encerramento de um bloco ou passagem para o próximo.

Não é necessário interromper a implementação por cada commit intermediário, ajuste cosmético, tentativa ou refino que não mude o estado real do projeto.

Antes de encerrar um checkpoint relevante, responder ao proprietário como se ele estivesse encerrado ou iniciar o próximo bloco funcional, confirme que **branch atual + `PROJECT_STATE.md` + bloco correspondente no Notion** contam a mesma história. Divergência conhecida deve ser sincronizada antes de prosseguir.

Se o Notion estiver temporariamente indisponível ou a atualização falhar, não invente sincronização concluída. Registre no `PROJECT_STATE.md` uma seção explícita **`Notion sync: PENDENTE`**, com motivo e itens que precisam ser enviados ao Notion. A operação atual pode ser concluída com segurança, mas essa pendência deve ser resolvida assim que o Notion voltar e **antes do próximo bloco funcional**.

Não exigir integração externa, token ou automação GitHub Actions → Notion para o fluxo normal. Os conectores disponíveis são o caminho padrão, salvo decisão futura específica do proprietário.

**Rastreabilidade:** N-012.

## Responsabilidade do agente

Dentro de um bloco autorizado, o agente decide e executa os testes necessários conforme risco e evidência. UX deve ser analisada pela tarefa real, fluxo completo, estados, segurança dos dados, clareza dos números e validação mobile.

O agente também é responsável por resolver as referências internas de um bloco autodirecionável. Códigos, SHAs, arquivos, links de CI e dependências técnicas são memória de máquina; não devem ser transferidos ao proprietário como pré-requisito para continuar o trabalho.

## Criação e uso de branches

Não criar branch nova quando a branch atual comportar o trabalho com segurança.

Criar uma nova branch exige sempre autorização explícita do proprietário. Antes de recomendar uma branch, o agente deve reavaliar se há impedimento real, considerar alternativas e explicar o custo de fragmentar conhecimento. Pressa, conveniência, existência de outro agente ou preferência por isolamento não são justificativas suficientes.

Antes da primeira alteração funcional numa branch realmente autorizada e necessária, confirme governança, estado específico, política da CI e fotografia de origem.

Branches temporárias ou históricas que receberam arquivos canônicos continuam temporárias ou históricas; a presença da skill não autoriza reutilização.

## Fechamento

Todo bloco técnico termina com estado atualizado, evidência fresca e uma das situações de aprendizado previstas em `LEARNING_RULES.md`.

Todo checkpoint relevante termina também com o Notion sincronizado; se o Notion estiver indisponível, termina apenas com `Notion sync: PENDENTE` explicitamente registrado no `PROJECT_STATE.md`, nunca com silêncio documental.

Toda alteração no GitHub deve ser traduzida ao proprietário em linguagem simples: onde mudou, por quê, efeito prático, o que ficou intocado, fotografia salva, testes/CI, publicação e pendências.

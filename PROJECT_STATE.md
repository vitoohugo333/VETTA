# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-03  
**Estado:** governança canônica, CI Universal Adaptativa e console autônomo operacionais.  
**Alteração em curso:** concluir a prova publicada OIDC da branch estável quando o Netlify servir a fotografia atual.

## Papel da `main`

A `main` é o centro de governança e orquestração. Ela não contém nem publica a versão atual do aplicativo.

Ela mantém:

- regras canônicas de agentes e testes;
- motor reutilizável `.github/workflows/ci-engine.yml`;
- orquestrador pelo issue #2;
- scripts de classificação, verificação e prova publicada;
- workflow autônomo para validar a própria governança;
- pontos de entrada para agentes em `START_HERE.md`, `CODEX.md`, `CLAUDE.md`, `GEMINI.md` e `.github/copilot-instructions.md`.

## Sequência obrigatória para qualquer agente

Na branch realmente afetada:

1. `AGENTS.md`;
2. `SKILLS.md`;
3. `TESTING_RULES.md`;
4. regras especializadas aplicáveis;
5. `LEARNING_RULES.md` quando houver aprendizado;
6. `PROJECT_STATE.md`;
7. fontes vivas atuais.

A CI compara os arquivos canônicos das branches ativas com a `main` e falha quando houver ausência ou divergência não autorizada.

## Branches operacionais confirmadas

| Branch | Fotografia atual | Papel | Evidência |
|---|---|---|---|
| `main` | `65d3822922ca7d35c792c3c216c81cf5ce150d89` antes deste checkpoint | governança e motor central | execução `30866080306` aprovada |
| `netlify/teste-fechado` | `0286d3ae53fea1f92ebab5cf74e5f95b0832f83b` | versão estável dos testadores | testes locais completos aprovados; publicação Netlify atrasada |
| `netlify/teste-fechado-ux` | `fdb037b4db81689ae5b29331d8efb1c3f5c03f58` | desenvolvimento de interface | infraestrutura aprovada em `30866364893`; trabalho de produto concorrente continua |
| `migration/vetta-clean-3-5-1` | `d5fd5868543bd859d7f571a14cfd0ea39860133d` | referência histórica e PR #1 | protegida, sem merge |

Branches antigas e temporárias continuam pendentes de limpeza autorizada e não devem ser reutilizadas.

## CI Universal Adaptativa

- `push`, `pull_request` e execução manual chamam o motor da `main`;
- o motor testa a fotografia exata da branch;
- arquivos alterados determinam a profundidade;
- todos os testes Node presentes são descobertos automaticamente;
- branches de aplicativo recebem navegador local;
- interface, armazenamento, cálculos integrados e PWA recebem Chromium móvel, Chromium desktop, Firefox e WebKit;
- ambiente publicado é provado quando a política da branch exigir;
- execuções ultrapassadas da mesma branch são canceladas;
- evidências de falha ficam por dois dias;
- a `main` é reconhecida como governança e não tenta executar aplicativo inexistente.

## Console autônomo do agente

O issue #2 permite ao conector iniciar testes sem intervenção manual do proprietário:

- `/vetta test <branch> auto`;
- `/vetta test <branch> full`;
- `/vetta test <branch> published`.

O console já disparou e recebeu resultados reais da `main`, da branch estável e da UX.

## Evidências fechadas

- `main`: governança e integridade aprovadas na execução `30866080306`;
- UX: testes determinísticos, Chromium móvel e desktop, Firefox, WebKit e GitHub Pages aprovados na execução `30866364893`;
- estável: testes determinísticos e os quatro perfis de navegador aprovados na execução `30866370117`;
- o motor capturou testes frágeis antigos e eles foram corrigidos para validar comportamento, não redação;
- o motor capturou trabalho concorrente na UX e devolveu falha precisa sem sobrescrever a branch;
- artefatos de falha passaram a usar a fotografia salva no nome e foram enviados corretamente.

## Bloqueio publicado da branch estável

O Netlify continua servindo a fotografia intermediária `05de0909e007428527bd989a16d866e8697c03ce`, enquanto a branch estável está em `0286d3ae53fea1f92ebab5cf74e5f95b0832f83b`.

A CI solicitou a identidade OIDC temporária com sucesso, mas recusou declarar a prova publicada porque o site ainda não contém a rota e o metadado finais. A rota antiga por senha permanece como retorno seguro até a prova OIDC real passar.

Nenhum deploy manual foi executado.

## Segurança

O motor apenas lê e testa. Não faz commit de produto, merge, deploy manual, mudança de dados ou publicação.

A identidade OIDC é temporária, limitada ao repositório, proprietário, workflow canônico, executor hospedado e audiência exclusiva.

## PR #1

A PR #1 permanece aberta em rascunho, ligada a `migration/vetta-clean-3-5-1`, sem merge e sem alteração neste bloco.

## Aprendizado

**Aprendizado fechado:** governança consistente e teste autônomo precisam ser executáveis. Regras em Markdown são comparadas pela CI, cada branch declara seu ambiente, e ambientes publicados não recebem aprovação quando servem fotografia diferente.

## Próximo passo único

Publicar no Netlify a fotografia atual da branch estável — pelo fluxo automático quando ele retomar ou por deploy manual explicitamente autorizado — e repetir `/vetta test netlify/teste-fechado published`. Somente após a prova verde, remover o acesso antigo por senha do robô.

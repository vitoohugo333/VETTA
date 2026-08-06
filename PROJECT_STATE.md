# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-06  
**Estado:** governança canônica, CI Universal Adaptativa e console autônomo operacionais; protocolo de identificação precisa de branches incorporado.  
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

## Classificação obrigatória das branches

Toda apuração deve distinguir quatro respostas diferentes:

| Classificação | Significado |
|---|---|
| Branch em uso por ambiente | branch configurada para alimentar GitHub Pages, Netlify ou outro ambiente |
| Branch modificada mais recentemente | branch com a fotografia salva de data mais nova |
| Branch mais atual por finalidade | branch funcionalmente correta e mais avançada para UX, produção, governança, migração ou outro papel |
| Branch efetivamente publicada | fotografia cujo conteúdo foi confirmado no ambiente servido |

A branch modificada por último não é automaticamente a branch correta para continuar o trabalho. Diante de divergência, o agente deve identificar a fonte desatualizada e corrigir o `PROJECT_STATE.md` no mesmo bloco.

## Branches operacionais confirmadas

| Branch | Fotografia registrada | Papel | Ambiente |
|---|---|---|---|
| `main` | `1b356a7393e976192405378a3f1558de10b0eca0` antes deste checkpoint | governança e motor central | não publica o aplicativo |
| `netlify/teste-fechado` | `0286d3ae53fea1f92ebab5cf74e5f95b0832f83b` | versão estável dos testadores | `https://calculaae.netlify.app/` |
| `netlify/teste-fechado-ux` | `fdb037b4db81689ae5b29331d8efb1c3f5c03f58` no último registro confirmado | desenvolvimento de interface e branch que alimenta o GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| `migration/vetta-clean-3-5-1` | `d5fd5868543bd859d7f571a14cfd0ea39860133d` | referência histórica e PR #1 | sem desenvolvimento novo |

As fotografias das branches de aplicativo acima são o último registro documentado neste arquivo e devem ser reconfirmadas antes de qualquer nova afirmação de atualidade. Branches antigas e temporárias continuam pendentes de limpeza autorizada e não devem ser reutilizadas.

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

## Evidências fechadas anteriores

- `main`: governança e integridade aprovadas na execução `30866080306`;
- UX: testes determinísticos, Chromium móvel e desktop, Firefox, WebKit e GitHub Pages aprovados na execução `30866364893`;
- estável: testes determinísticos e os quatro perfis de navegador aprovados na execução `30866370117`;
- o motor capturou testes frágeis antigos e eles foram corrigidos para validar comportamento, não redação;
- o motor capturou trabalho concorrente na UX e devolveu falha precisa sem sobrescrever a branch;
- artefatos de falha passaram a usar a fotografia salva no nome e foram enviados corretamente.

Essas evidências provam as fotografias testadas naquele momento; não substituem uma nova checagem após commits posteriores.

## Bloqueio publicado da branch estável

No último registro confirmado, o Netlify servia a fotografia intermediária `05de0909e007428527bd989a16d866e8697c03ce`, enquanto a branch estável estava em `0286d3ae53fea1f92ebab5cf74e5f95b0832f83b`.

A CI solicitou a identidade OIDC temporária com sucesso, mas recusou declarar a prova publicada porque o site ainda não continha a rota e o metadado finais. Esse estado deve ser reconfirmado antes de qualquer ação de publicação.

Nenhum deploy manual foi executado neste bloco.

## Segurança

O motor apenas lê e testa. Não faz commit de produto, merge, deploy manual, mudança de dados ou publicação.

A identidade OIDC é temporária, limitada ao repositório, proprietário, workflow canônico, executor hospedado e audiência exclusiva.

## PR #1

A PR #1 permanece registrada como aberta em rascunho, ligada a `migration/vetta-clean-3-5-1`, sem merge. O estado vivo deve ser reconfirmado quando a PR for relevante para uma decisão.

## Aprendizado

**Aprendizado fechado em 2026-08-06:** uma apuração confundiu uma branch antiga de trabalho com a branch realmente usada pelo GitHub Pages. A causa foi ancoragem em um `PROJECT_STATE.md` isolado e uso impreciso de “branch atual”.

Proteção permanente incorporada ao `AGENTS.md`:

- separar branch em uso, mais recentemente modificada, mais atual por finalidade e efetivamente publicada;
- não deduzir ambiente pelo nome da branch;
- tratar `PROJECT_STATE.md` como registro oficial vivo e mantê-lo atualizado no mesmo bloco;
- cruzar documentação, fotografias, PR, CI, configuração do ambiente e conteúdo servido conforme o risco;
- declarar divergência em vez de escolher uma fonte por viés.

## Próximo passo único

Concluir a prova publicada da branch estável quando o Netlify servir a fotografia atual e, antes disso, reconfirmar o estado vivo da branch e do ambiente publicado.

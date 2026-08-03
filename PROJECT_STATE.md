# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-03  
**Estado:** `main` organizada como painel de controle e acionamento manual; não contém o aplicativo atual.  
**Alteração em curso:** cadastro do segredo do robô e primeira execução do teste remoto ainda pendentes.

## Papel da `main`

A `main` é a branch padrão do GitHub e serve para:

- apresentar as regras gerais do repositório;
- orientar agentes a localizar e ler a branch realmente afetada;
- disponibilizar workflows que o GitHub exige na branch padrão;
- permanecer protegida contra cópia ou publicação acidental do aplicativo.

Ela não alimenta `calculaae.netlify.app` e não contém a versão atual do aplicativo.

## Branches e ambientes atuais

| Branch | Papel | Ambiente |
|---|---|---|
| `main` | controle, governança e lançador manual | nenhum aplicativo servido |
| `netlify/teste-fechado` | versão estável dos testadores | `https://calculaae.netlify.app` |
| `netlify/teste-fechado-ux` | desenvolvimento da reorganização da interface | GitHub Pages pendente de confirmação |
| `migration/vetta-clean-3-5-1` | referência histórica permanente e PR #1 | nenhum desenvolvimento novo |

Branches antigas continuam presentes e devem ser ignoradas até limpeza autorizada e tecnicamente possível.

## Alterações feitas na `main`

- `AGENTS.md` agora explica que regras e estados pertencem à branch onde estão;
- `SKILLS.md` funciona como índice de controle e obriga a leitura da branch-alvo;
- `.github/workflows/test-usage-manual.yml` disponibiliza o teste remoto somente sob acionamento manual;
- nenhum HTML, JavaScript do aplicativo, cálculo, dado, manifesto, service worker ou arquivo de interface foi copiado para a `main`.

## Credencial do robô

- o Netlify possui a variável secreta `VETTA_ACCESS_ROBOT_HASH`;
- a branch estável possui a rota isolada `/__vetta-robot-access`;
- a senha em texto não está no GitHub nem no Netlify;
- falta cadastrar `VETTA_TEST_PASSWORD` como segredo do GitHub;
- o conector GitHub não oferece criação de segredo e o `gh` não está instalado neste ambiente.

## Custo e desativação

O workflow:

- roda apenas manualmente;
- usa uma máquina Linux e um Chromium;
- tem limite de oito minutos;
- não grava vídeo;
- guarda evidências somente em falha por um dia.

Pode ser desativado removendo o workflow, apagando o segredo do GitHub ou apagando a variável do Netlify. Nenhuma dessas ações altera o aplicativo.

## PR e publicação

- a PR #1 continua aberta em rascunho e não foi alterada;
- não houve merge;
- a `main` não foi ligada ao Netlify;
- o aplicativo dos testadores continua vindo de `netlify/teste-fechado`.

## Desvio registrado

A branch `tmp/robot-access-safe` foi criada por engano e não recebeu arquivos. O conector atual não oferece exclusão de branch; ela deve ser removida manualmente pela interface do GitHub e nunca usada para desenvolvimento.

## Próximo passo único

Cadastrar o segredo `VETTA_TEST_PASSWORD` nas configurações do GitHub. Depois, executar `Testar uso remoto do CalculaAê`, selecionando `netlify/teste-fechado` e mantendo o endereço padrão `https://calculaae.netlify.app`.

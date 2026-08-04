# Estado oficial — CalculaAê (`netlify/teste-fechado`)

**Atualizado em:** 2026-08-03  
**Estado:** versão estável preservada; CI Universal Adaptativa e acesso OIDC do robô instalados.  
**Alteração em curso:** primeira prova automática local e publicada.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado` |
| Papel | versão estável dos testadores |
| Site | `https://calculaae.netlify.app/` |
| Branch UX separada | `netlify/teste-fechado-ux` |
| Referência histórica | `migration/vetta-clean-3-5-1` |

## O que mudou neste bloco

Somente infraestrutura de engenharia:

- regras canônicas sincronizadas com a `main`;
- workflow autônomo da branch;
- política de ambiente em `ci/branch-policy.json`;
- Playwright adaptado a Chromium, Firefox e WebKit;
- teste publicado genérico;
- autenticação temporária OIDC do GitHub Actions;
- metadado de deploy com commit e branch;
- testes determinísticos do contrato OIDC.

## O que permaneceu intocado

- interface;
- cálculos;
- registros e armazenamento local;
- manifesto, service worker, cache e ícones;
- senhas dos testadores;
- fluxo normal de instalação e abertura;
- branch UX, `main` como aplicativo e PR #1.

## Acesso do robô

O novo caminho `/__vetta-oidc-access` aceita somente identidade temporária assinada pelo GitHub e vinculada a:

- repositório imutável do VETTA;
- proprietário autorizado;
- motor canônico da `main`;
- executor hospedado pelo GitHub;
- evento permitido;
- audiência exclusiva.

A sessão dura 15 minutos. A rota antiga por senha permanece temporariamente apenas como retorno seguro até a primeira prova OIDC passar.

## Validação

A CI deve executar:

- governança e sintaxe;
- todos os testes `tests/**/*.test.mjs`;
- navegador local conforme a classificação;
- ambiente publicado com confirmação do commit servido;
- artefatos somente em falha.

## Validação física

Nenhuma mudança visual ou de PWA foi feita neste bloco. Nova validação física não é necessária para a infraestrutura, salvo se a prova revelar comportamento diferente no aplicativo.

## Aprendizado

**Aprendizado fechado:** a automação deve pertencer à branch e ao risco, não a um provedor de hospedagem específico. Netlify é apenas um adaptador de prova publicada.

## Próximo passo único

Confirmar a primeira execução automática e publicada desta fotografia. Se a identidade OIDC passar, remover a rota e a variável antigas baseadas em senha.

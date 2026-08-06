# Estado oficial — VETTA (`governance/vetta-product-ux`)

**Atualizado em:** 2026-08-06  
**Estado:** skill própria de lógica de produto e UX criada e registrada; aguardando prova automática de governança.  
**Alteração em curso:** validar a consistência documental da skill antes de qualquer decisão de adoção nas branches do aplicativo.

## Papel desta branch

A branch `governance/vetta-product-ux` nasceu da fotografia `0ed6817e75f435b76d69b736dd2c87a4e0e52834` da `main`.

Ela existe somente para desenvolver e revisar a governança da experiência do VETTA. Não contém mudança de aplicativo, interface, cálculos, dados, armazenamento, PWA ou publicação.

## Objetivo observável

Fazer com que qualquer agente trate UX como fluxo completo e seguro, não apenas como aparência visual.

A skill exige:

- tarefa real do motorista antes da tela;
- fluxo principal, edição, cancelamento, retorno e interrupção;
- estados vazio, carregando, salvando, sucesso e erro;
- preservação de dados e cálculos;
- lógica mobile e contexto de condução;
- clareza da origem e do significado dos números;
- testes proporcionais e validação física quando houver mudança visual.

## Arquivos deste bloco

| Arquivo | Função |
|---|---|
| `.skills/vetta-product-ux/SKILL.md` | regra especializada de lógica de produto e UX |
| `SKILLS.md` | registro e ordem obrigatória de leitura da skill |
| `ci/branch-policy.json` | identifica esta branch como governança de UX, sem aplicativo publicado |
| `PROJECT_STATE.md` | estado vivo específico desta branch |

## Estado dos ambientes

| Ambiente | Branch em uso | Alterado neste bloco? |
|---|---|---|
| GitHub Pages | `netlify/teste-fechado-ux` | não |
| Netlify estável | `netlify/teste-fechado` | não |
| Governança canônica | `main` | não após a criação desta branch |
| Migração histórica / PR #1 | `migration/vetta-clean-3-5-1` | não |

## O que permaneceu intocado

- aplicativo e identidade visual;
- navegação `Agora | Registrar | Resultados | Custos | Mais` no código;
- cálculos financeiros;
- registros e armazenamento local;
- service worker, manifesto e gate de instalação;
- GitHub Pages e Netlify;
- PR #1;
- `main` após a fotografia de origem.

## Riscos e limites

- Esta skill ainda não foi adotada nas branches do aplicativo.
- A presença do arquivo não prova que todos os agentes externos o carregarão automaticamente; o `SKILLS.md` torna a leitura obrigatória dentro da governança do repositório.
- A CI canônica precisa confirmar integridade e consistência da fotografia final.
- Existem branches antigas e temporárias além da estrutura planejada; esta branch foi criada por autorização explícita para isolar o trabalho e não autoriza reutilizar as temporárias.

## Aprendizado

**Aprendizado fechado:** lógica de UX precisa de uma regra especializada que obrigue tarefa, fluxo, estados, segurança dos dados, clareza dos números e prova mobile antes de aceitar uma proposta ou alteração visual.

## Próximo passo único

Confirmar a CI e revisar a fotografia final desta branch; somente depois decidir se a skill será incorporada à `main` e distribuída às branches ativas do aplicativo.

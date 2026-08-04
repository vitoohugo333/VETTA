# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-03  
**Estado:** governança canônica e CI Universal Adaptativa instaladas.  
**Alteração em curso:** validação das primeiras execuções autônomas nas branches ativas.

## Papel da `main`

A `main` é o centro de governança e orquestração. Ela não contém nem publica a versão atual do aplicativo.

Ela mantém:

- regras canônicas de agentes e testes;
- motor reutilizável `.github/workflows/ci-engine.yml`;
- orquestrador pelo issue #2;
- scripts de classificação, verificação e prova publicada;
- workflow autônomo para validar a própria governança.

## Branches operacionais

| Branch | Papel | Ambiente |
|---|---|---|
| `main` | governança e motor central | nenhum aplicativo servido |
| `netlify/teste-fechado` | versão estável dos testadores | `https://calculaae.netlify.app/` |
| `netlify/teste-fechado-ux` | desenvolvimento de interface | `https://vitoohugo333.github.io/VETTA/` |
| `migration/vetta-clean-3-5-1` | referência histórica permanente e PR #1 | sem desenvolvimento novo |

Branches antigas e temporárias continuam pendentes de limpeza autorizada e não devem ser reutilizadas.

## CI Universal Adaptativa

- push, pull request e execução manual chamam o motor da `main`;
- o motor testa a fotografia exata da branch;
- arquivos alterados determinam a profundidade;
- todos os testes Node presentes são descobertos automaticamente;
- mudanças funcionais recebem navegador;
- interface, armazenamento, cálculos integrados e PWA recebem Chromium, Firefox e WebKit;
- ambiente publicado é provado quando a política da branch exigir;
- execuções ultrapassadas da mesma branch são canceladas;
- artefatos de falha ficam por dois dias.

## Console do agente

O issue #2, `VETTA — Console de Testes Autônomos`, permite ao agente solicitar cobertura adicional de qualquer branch sem pedir ao proprietário para apertar botões.

Comandos aceitos:

- `/vetta test <branch> auto`;
- `/vetta test <branch> full`;
- `/vetta test <branch> published`.

Somente o proprietário e o formato fechado são aceitos.

## Segurança

O motor apenas lê e testa. Não faz commit, merge, deploy manual, mudança de dados ou publicação.

A prova do Netlify protegido usa identidade OIDC temporária do GitHub, sem segredo persistente no GitHub.

## PR #1

A PR #1 permanece aberta em rascunho, ligada a `migration/vetta-clean-3-5-1`, sem merge e sem alteração neste bloco.

## Próximo passo único

Confirmar as primeiras execuções automáticas da `main`, da branch estável e da branch UX; depois registrar os resultados e retirar o acesso antigo por senha do robô se a prova OIDC passar.

# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-07, horário de Brasília  
**Estado:** governança canônica operacional sincronizada com o modelo de blocos autodirecionáveis do Notion.  
**Papel:** `main` mantém governança, regras canônicas e orquestração; não publica o aplicativo.

## Sincronização operacional de 07/08/2026

O modelo de trabalho em que o proprietário opera por comandos humanos simples foi incorporado à governança canônica:

- `Liste os blocos ativos do VETTA.`
- `Leia o bloco X e siga-o.`

A partir de um bloco citado, o agente deve recuperar sozinho Central Oficial, Estado, Roadmap, decisões, aprendizados, códigos `N-xxx`, branch, fotografia, PR, CI, ambiente, regras técnicas e demais dependências. O proprietário não precisa memorizar códigos, SHAs, arquivos ou sequências técnicas.

O Notion continua sendo memória operacional de missão, decisões e aprendizados. GitHub, PR, CI e ambientes servidos continuam sendo a prova técnica viva.

## Governança canônica vigente

- `AGENTS.md`: `VETTA_GOVERNANCE_VERSION: 2026-08-07.1`;
- `SKILLS.md`: `VETTA_GOVERNANCE_VERSION: 2026-08-07.1`;
- fotografia da `main` após esses dois arquivos: `2b848291f21065463e794b3898ce2e777a53ae0d`;
- a branch `refatoracao-360-ux` foi incluída na governança como experimento temporário de UI/UX sem ambiente publicado próprio;
- criação de branch exige autorização explícita do proprietário, precedida de reavaliação e justificativa didática quando recomendada.

## Branches e ambientes relevantes

| Finalidade | Branch | Ambiente |
|---|---|---|
| Governança canônica | `main` | não publica o app |
| Produção estável/testadores | `netlify/teste-fechado` | Netlify estável |
| Desenvolvimento de UX atual | `netlify/teste-fechado-ux` | GitHub Pages |
| Experimento Refatoração 360 | `refatoracao-360-ux` | nenhum ambiente publicado próprio confirmado |
| Referência histórica | `migration/vetta-clean-3-5-1` | sem desenvolvimento novo |

`netlify/teste-fechado` e `netlify/teste-fechado-ux` não foram alteradas neste bloco de sincronização, evitando qualquer efeito em Netlify ou GitHub Pages.

## Impacto deste bloco

Somente governança e documentação foram alteradas. Nenhum arquivo funcional do aplicativo, cálculo financeiro, dado, armazenamento, interface, PWA, Netlify ou GitHub Pages foi alterado.

## Validação

A prova necessária é documental: `AGENTS.md` e `SKILLS.md` da `main` devem conter o modelo novo e a branch experimental deve receber as mesmas cópias canônicas. CI deve ser verificada na fotografia final, mas nenhum teste funcional/mobile é necessário porque o aplicativo não foi modificado.

## Aprendizado

**Nenhum aprendizado permanente novo.** Este bloco sincroniza no GitHub decisões operacionais já aprovadas no Notion.

## Próximo passo único

Usar o comando humano do bloco desejado; o agente deve resolver todo o restante do contexto sem exigir que o proprietário reconstrua a memória técnica.

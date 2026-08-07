# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-07, horário de Brasília  
**Estado:** governança canônica operacional sincronizada com o modelo de blocos autodirecionáveis do Notion e com a política de fallback do Codex Engineering Guardrails.  
**Papel:** `main` mantém governança, regras canônicas e orquestração; não publica o aplicativo.

## Sincronização operacional de 07/08/2026

O modelo de trabalho em que o proprietário opera por comandos humanos simples foi incorporado à governança canônica:

- `Liste os blocos ativos do VETTA.`
- `Leia o bloco X e siga-o.`

A partir de um bloco citado, o agente deve recuperar sozinho Central Oficial, Estado, Roadmap, decisões, aprendizados, códigos `N-xxx`, branch, fotografia, PR, CI, ambiente, regras técnicas e demais dependências. O proprietário não precisa memorizar códigos, SHAs, arquivos ou sequências técnicas.

O Notion continua sendo memória operacional de missão, decisões e aprendizados. GitHub, PR, CI e ambientes servidos continuam sendo a prova técnica viva.

## Codex Engineering Guardrails

A regra operacional vigente é simples:

1. tentar primeiro o plugin **Codex Engineering Guardrails**;
2. se a descoberta ou o carregamento do plugin falhar, usar diretamente a skill adequada;
3. `code-verification` para diagnóstico, auditoria, revisão, testes e validação sem alteração de produção;
4. `code-work` para qualquer mudança autorizada;
5. só declarar o Guardrails indisponível se o plugin e a skill aplicável falharem.

O agente escolhe a skill correta pela natureza da tarefa. O proprietário não precisa indicar o nome da skill.

## Governança canônica vigente

- `AGENTS.md`: `VETTA_GOVERNANCE_VERSION: 2026-08-07.1`;
- `SKILLS.md`: `VETTA_GOVERNANCE_VERSION: 2026-08-07.2`;
- fotografia da `main` que incorporou a política de fallback no índice técnico: `e8a862ca3be037c7e3db27311a4f6ae42c337f67`;
- a branch `refatoracao-360-ux` recebeu a mesma política canônica;
- criação de branch exige autorização explícita do proprietário, precedida de reavaliação e justificativa didática quando recomendada.

## Branches e ambientes relevantes

| Finalidade | Branch | Ambiente |
|---|---|---|
| Governança canônica | `main` | não publica o app |
| Produção estável/testadores | `netlify/teste-fechado` | Netlify estável |
| Desenvolvimento de UX atual | `netlify/teste-fechado-ux` | GitHub Pages |
| Experimento Refatoração 360 | `refatoracao-360-ux` | nenhum ambiente publicado próprio confirmado |
| Referência histórica | `migration/vetta-clean-3-5-1` | sem desenvolvimento novo |

`netlify/teste-fechado` e `netlify/teste-fechado-ux` não foram alteradas neste bloco, evitando qualquer efeito em Netlify ou GitHub Pages.

## Impacto deste bloco

Somente governança e documentação foram alteradas. Nenhum arquivo funcional do aplicativo, cálculo financeiro, dado, armazenamento, interface, PWA, Netlify ou GitHub Pages foi alterado.

## Validação

A prova necessária é documental: `SKILLS.md` da `main` e da branch experimental devem ser idênticos e conter a política plugin-primeiro/skill-fallback. Nenhum teste funcional ou validação mobile é necessário porque o aplicativo não foi modificado.

## Aprendizado

**Aprendizado fechado:** falha de descoberta do plugin não prova indisponibilidade do Guardrails quando a skill aplicável pode ser carregada diretamente.

## Próximo passo único

Continuar o trabalho normalmente; agentes devem tentar o plugin primeiro e recorrer à skill adequada sem transferir essa escolha ao proprietário.

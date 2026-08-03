# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03  
**Estado:** PWA validado no Android; nova credencial carregada; Bloco 0 concluído sem alteração do aplicativo.  
**Alteração em curso:** nenhuma no aplicativo; aguardando decisão sobre branches e separação dos testadores antes do Bloco 1.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch de validação | `netlify/teste-fechado` |
| Fotografia funcional validada no Android | `0b3ff2da3ecad020abb2294dbb616df132b874ff` |
| Relatório concluído do Bloco 0 | `docs/planos/01-BLOCO-0-REFERENCIA-E-PROTECAO-DA-BASE.md` |
| Fotografia do Plano 01 atualizado | `3f5f575ad9759278be59cd298373228d1d0610f5` |
| Site de validação | `calculaae.netlify.app` |
| Deploy que carregou o Bloco 0 e a configuração de acesso | `6a711358794b6c00087122a9`, pronto e ligado a `3f5f575ad9759278be59cd298373228d1d0610f5` |
| Plano de produto ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
| Sistema de aprendizado técnico | `LEARNING_RULES.md` e `docs/incidents/` ativos |
| `main` | não alterada; `2a42c39612ec161bf58f16bbbbbd26521f28d30a` |

## Validação física informada pelo proprietário

- O botão de instalação abriu a janela nativa do Android.
- O PWA foi instalado com sucesso.
- O aplicativo foi fechado completamente e aberto pelo ícone duas vezes.
- Nenhuma parte da tela de instalação apareceu nas duas aberturas.
- Resultado físico final do PWA no Android: aprovado.

## Credenciais de acesso

- A lista de acesso do Netlify contém três credenciais sem data de expiração.
- A nova credencial foi adicionada preservando as duas entradas anteriores.
- O Netlify confirmou a configuração nos contextos `dev`, `branch-deploy`, `deploy-preview` e `production`.
- A senha em texto não foi gravada no GitHub; o sistema mantém apenas o hash no ambiente do Netlify.
- O deploy `6a711358794b6c00087122a9` foi concluído depois da atualização e incluiu a Edge Function de acesso.
- O login real com a nova credencial não foi exercitado automaticamente porque o ambiente externo de teste não conseguiu resolver o domínio. Falta uma tentativa manual de entrada.

## Bloco 0 — resultado confirmado

O Bloco 0 foi concluído como diagnóstico, referência e contrato. Nenhum arquivo funcional do aplicativo foi alterado.

Foram registrados:

- branch, fotografia e deploy de referência;
- telas e fluxos atuais;
- comportamentos de dados, cálculos, navegação, PWA e aparência que não podem regredir;
- cobertura de testes existente;
- lacunas de testes e publicação;
- branches e PR existentes;
- contrato proposto do Bloco 1.

O relatório completo está em `docs/planos/01-BLOCO-0-REFERENCIA-E-PROTECAO-DA-BASE.md`.

## Branches e PR

Existem seis branches remotas, acima do limite permanente de quatro:

| Branch | Situação confirmada |
|---|---|
| `main` | produção protegida; permanece intocada |
| `netlify/teste-fechado` | branch atual, mais nova e ligada ao site de validação |
| `migration/vetta-clean-3-5-1` | ancestral da branch atual; sem trabalho exclusivo mais novo |
| `feature/bloco-1-navegacao-secundaria` | ancestral da branch atual; sem trabalho exclusivo mais novo |
| `tmp/pwa-gate-apply` | temporária; aponta para ancestral antigo |
| `tmp/pwa-gate-apply-2` | temporária; aponta para ancestral antigo |

A PR #1 permanece aberta em rascunho, aponta da branch de migração para `main` e foi superada pela branch de validação atual. Nenhuma branch foi removida, nenhuma PR foi fechada e nenhum merge foi feito.

## Testes e lacunas

### Cobertura existente

- sintaxe e contrato estático da versão protegida;
- sessão, expiração e comparação de credenciais;
- barreira de acesso e arquivos técnicos do PWA;
- abertura standalone sem piscada;
- modal de custos sem duplicação;
- navegação secundária, botão voltar e preservação do formulário;
- fluxo básico de instalação.

### Pendências antes ou durante o Bloco 1

- a branch de validação não possui CI automática associada a cada push;
- faltam testes determinísticos independentes da interface para todas as fórmulas financeiras;
- faltam coberturas completas de registros diários, importação, exportação, onboarding e recuperação de dados;
- o teste E2E do gate do PWA contém texto de uma versão anterior e precisa ser executado e alinhado;
- `tests/README.md` cita um cache antigo;
- workflows de `main` ainda apontam para o domínio antigo e não refletem todo o conjunto atual de arquivos;
- dependências visuais externas precisam ser consideradas em testes offline;
- `app.js` possui camadas de compatibilidade que não podem ser refatoradas junto com a mudança visual.

Essas lacunas foram documentadas, não corrigidas neste bloco.

## Evidência técnica principal

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-03 | Correção da barreira do PWA | `d20128067a5c9a671508cd75a1bed6027129aeae` | arquivos técnicos deixaram de ser bloqueados |
| 2026-08-03 | Abertura standalone | `7cf88fe311f5acd13d020f39a798edde7c416afe`, `a4f1d029a998c22fa4b3325d8475055ba8e5f5c2` e `0b3ff2da3ecad020abb2294dbb616df132b874ff` | abertura sem tela de instalação |
| 2026-08-03 | Validação física do PWA | confirmação do proprietário no Android | instalação e duas aberturas aprovadas |
| 2026-08-03 | Sistema permanente de aprendizado | `LEARNING_RULES.md`, `SKILLS.md` e `docs/incidents/` | causa, prevenção e provas passaram a ser preservadas |
| 2026-08-03 | Regra de clareza do próximo passo | `c6fd430886f6d4d2b7ac05b1dbb3cab76d76d0d3` | autorizações futuras exigem escopo explicado |
| 2026-08-03 | Nova credencial | configuração do Netlify, sem senha em texto no repositório | três credenciais preservadas e carregadas pelo deploy |
| 2026-08-03 | Referência do Bloco 0 | `fa52adcb92afc9f624c1d8cd306a70d31f2c94e2` | inventário, riscos, testes e contrato registrados |
| 2026-08-03 | Plano 01 atualizado | `3f5f575ad9759278be59cd298373228d1d0610f5` | Bloco 0 marcado como concluído e Bloco 1 como não iniciado |
| 2026-08-03 | Deploy do Bloco 0 | `6a711358794b6c00087122a9` | pronto, sem erro e ligado à fotografia esperada |

## Ainda não confirmado

- login manual com a nova credencial;
- fluxo completo no iPhone/Safari;
- CI completa da fotografia atual;
- separação operacional entre testadores e desenvolvimento;
- nenhum item do Bloco 1 foi implementado ou validado no celular.

## Aprendizado do bloco

**Nenhum aprendizado permanente novo.**

O Bloco 0 aplicou as regras já existentes de inventário, evidência, ambientes e proteção contra regressões. As divergências encontradas são pendências atuais e estão no relatório, sem constituir novo incidente técnico.

## Próximo passo único — decisão necessária antes do Bloco 1

Escolher uma das opções abaixo. Esta decisão organiza branches e ambiente; ainda não autoriza alterar a interface.

### Opção 1 — separação recomendada

Autorizar:

1. fechar a PR #1 sem merge;
2. excluir as quatro branches antigas ou temporárias: `migration/vetta-clean-3-5-1`, `feature/bloco-1-navegacao-secundaria`, `tmp/pwa-gate-apply` e `tmp/pwa-gate-apply-2`;
3. manter `main` e `netlify/teste-fechado` intactas;
4. congelar `netlify/teste-fechado` como versão dos testadores;
5. criar uma nova branch `feature/plano-01-bloco-1` a partir da fotografia atual;
6. confirmar se o Netlify fornece um endereço separado para essa branch; se não fornecer, parar antes de alterar configuração.

Resultado: testadores continuam numa versão estável enquanto o Bloco 1 evolui em outro endereço.

Esta autorização não inclui implementar o Bloco 1, alterar `main`, fazer merge, mudar PWA, acesso, cálculos ou dados.

### Opção 2 — caminho simples

Autorizar:

1. fechar a PR #1 sem merge;
2. excluir as quatro branches antigas ou temporárias;
3. continuar futuramente o Bloco 1 em `netlify/teste-fechado`;
4. interromper temporariamente os testes externos, porque `calculaae.netlify.app` mudará a cada commit.

Resultado: menos branches e configuração, mas sem uma versão congelada para testadores durante o desenvolvimento.

Esta autorização também não inclui implementar o Bloco 1 nem alterar `main`, PWA, acesso, cálculos ou dados.

Depois da escolha, o próximo pedido de autorização será o contrato específico do Bloco 1: reorganizar `Hoje | Histórico | Planejar | Mais`, criar as proteções de cálculo e dados necessárias e exigir validação física no Android.
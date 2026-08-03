# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03
**Estado:** instalação e abertura sem piscada validadas no Android; sistema permanente de aprendizado técnico ativo.
**Alteração em curso:** nenhuma no PWA; próximo trabalho de produto é o Bloco 0 do Plano 01.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch de validação | `netlify/teste-fechado` |
| Fotografia funcional validada no Android | `0b3ff2da3ecad020abb2294dbb616df132b874ff` |
| Site de validação | `https://calculaae.netlify.app/` |
| Deploy usado na validação final | `6a710c5830b5fe00085ea689`, pronto e ligado a `b72d8f5e04c58d16982ffaa370e856053be23d20` |
| Plano de produto ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
| Sistema de aprendizado técnico | `LEARNING_RULES.md` e `docs/incidents/` ativos |
| `main` | não alterada |

## Validação física informada pelo proprietário

- O botão de instalação abriu a janela nativa do Android.
- O PWA foi instalado com sucesso.
- Após a correção da abertura, o aplicativo foi fechado completamente e aberto pelo ícone duas vezes.
- Nenhuma parte da tela de instalação apareceu nas duas aberturas.
- Resultado físico final no Android: aprovado.

## Confirmado agora

- A barreira continua protegendo as páginas do aplicativo e permite os cinco arquivos técnicos necessários ao PWA.
- A piscada acontecia porque o PWA iniciava em `index.html` e aguardava uma busca assíncrona por `app-shell.html`.
- Novas instalações abrem diretamente `app-shell.html` pelo `start_url` do manifesto.
- Instalações antigas são detectadas no `<head>`; a página de instalação é ocultada antes do primeiro desenho e redirecionada imediatamente.
- A substituição assíncrona do documento foi removida.
- O cache foi renovado para `calculaae-install-flow-5`.
- Os testes focados `pwa-access-boundary` e `pwa-standalone-launch` passaram.
- A instalação e a abertura sem piscada foram validadas fisicamente no Android pelo proprietário.
- `AGENTS.md` continua sendo a regra principal de autoridade, escopo e execução por blocos.
- `SKILLS.md` agora obriga a leitura de `LEARNING_RULES.md` ao encerrar blocos com defeitos, quase falhas ou descobertas reutilizáveis.
- `LEARNING_RULES.md` define o Ciclo de Aprendizado Fechado sem exigir autorizações adicionais dentro de blocos já aprovados.
- O processo diferencia incidente de aprendizado preventivo e considera reutilização em futuros aplicativos.
- `docs/incidents/README.md` funciona como índice e guia prático.
- `docs/incidents/TEMPLATE.md` padroniza sintoma, causa imediata, causa estrutural, falha de detecção, prevenção e prova.
- `INC-0001` registra a barreira de acesso que bloqueou arquivos técnicos do PWA.
- `INC-0002` registra a piscada causada pela mistura entre página de instalação e entrada standalone.
- Os dois incidentes apontam para regras em `PWA_RULES.md` e testes automatizados já existentes.
- Erros pequenos sem conhecimento relevante não exigem incidente completo.
- Mitigações urgentes não são bloqueadas pela documentação; o aprendizado deve ser fechado antes de encerrar o bloco.
- `docs/planos/README.md` é o índice dos planos atuais.
- `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` continua sendo o único plano ativo.
- Interface interna, cálculos, dados financeiros, navegação, PWA funcional e `main` não foram alterados neste bloco documental.

## Evidência técnica

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-03 | Correção da barreira | commit `d20128067a5c9a671508cd75a1bed6027129aeae` | arquivos técnicos do PWA deixaram de ser bloqueados |
| 2026-08-03 | Compatibilidade com instalações antigas | commit `7cf88fe311f5acd13d020f39a798edde7c416afe` | instalação escondida e redirecionamento antes do `body` |
| 2026-08-03 | Abertura direta | commit `a4f1d029a998c22fa4b3325d8475055ba8e5f5c2` | manifesto passou a abrir `app-shell.html` |
| 2026-08-03 | Renovação do cache | commit `0b3ff2da3ecad020abb2294dbb616df132b874ff` | cache atualizado para `calculaae-install-flow-5` |
| 2026-08-03 | Testes de regressão | commits `3d10deb5d5ca9e7009e7affe1227b4002a1bc26f`, `1bed951029fd8fee3df28a5a06852e7fe4d98845`, `4211f938f530cf68fd831c250d725e050790379b` e `870066f67a1016b32d5d35510a25f91eea813926` | contrato de abertura standalone incluído na verificação |
| 2026-08-03 | Planos de produto | commits `5b3d9d07dcfa3f1aa79d25207c9f1d8b60dcca95`, `6ab43efecb01d7fbc403f1a2afeae488eaa86b47` e `e033b0a041f4c5edb05e711795655979256ad831` | plano ativo preservado e registrado |
| 2026-08-03 | Validação física final do PWA | confirmação do proprietário no Android, deploy `6a710c5830b5fe00085ea689` | instalação aprovada e duas aberturas pelo ícone sem piscada |
| 2026-08-03 | Ciclo permanente de aprendizado | commit `bf861d22de4b5ff7f83384b1d8a982f067556016` | critérios, equilíbrio prático e fechamento obrigatório definidos |
| 2026-08-03 | Índice e modelo de incidentes | commits `ca617ec5dee4d09634480c6d97bb4a6ab39cc828` e `36ae43ead600405b1f1aa9cbc214328ac0941e99` | registros futuros padronizados e localizáveis |
| 2026-08-03 | Incidentes iniciais | commits `bcc0028105ccbaca65ce1ba3c639eddaf7363afb` e `ec410eb27c66a1c70268ee4da511ae54ce7bbae3` | aprendizados reais do PWA preservados para reutilização |
| 2026-08-03 | Roteamento obrigatório | commit `123283c6476eef6596bfdb809ed84fb527495e58` | próximos agentes encontram e aplicam o fluxo por meio do `SKILLS.md` |

## Ainda não confirmado

- Fluxo completo no iPhone/Safari.
- Não há CI associada à branch. A verificação ampla não rodou na cópia isolada porque ela não continha o `app.js` completo; os testes focados do PWA passaram e o build do Netlify terminou sem erro.
- Nenhum bloco de interface do Plano 01 foi implementado ou validado no celular.

## Próximo passo único

Iniciar o **Bloco 0 — Referência e proteção da base** do Plano 01, sem alterar ainda a interface.

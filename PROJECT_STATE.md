# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03
**Estado:** instalação e abertura sem piscada validadas no Android; bloco corretivo do PWA concluído.
**Alteração em curso:** nenhuma no PWA; próximo trabalho é o Bloco 0 do Plano 01.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch de validação | `netlify/teste-fechado` |
| Fotografia funcional validada no Android | `0b3ff2da3ecad020abb2294dbb616df132b874ff` |
| Site de validação | `https://calculaae.netlify.app/` |
| Deploy usado na validação final | `6a710c5830b5fe00085ea689`, pronto e ligado a `b72d8f5e04c58d16982ffaa370e856053be23d20` |
| Plano de produto ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
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
- `AGENTS.md` registra progresso por etapas, checkpoints e os limites de atualizações em tempo real.
- `SKILLS.md` define onde cada tipo de aprendizado deve ser guardado.
- `PWA_RULES.md` registra causa, prevenção, teste e validação física da abertura sem piscada.
- `docs/planos/README.md` é o índice dos planos atuais.
- `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` continua sendo o único plano ativo.
- O plano ativo não autoriza alterar instalação, manifesto, service worker ou cache do PWA.
- Interface interna, cálculos, dados financeiros, navegação e `main` não foram alterados neste bloco.

## Evidência técnica

| Data | Ação | Evidência | Resultado |
|---|---|---|---|
| 2026-08-03 | Correção da barreira | commit `d20128067a5c9a671508cd75a1bed6027129aeae` | arquivos técnicos do PWA deixaram de ser bloqueados |
| 2026-08-03 | Compatibilidade com instalações antigas | commit `7cf88fe311f5acd13d020f39a798edde7c416afe` | instalação escondida e redirecionamento antes do `body` |
| 2026-08-03 | Abertura direta | commit `a4f1d029a998c22fa4b3325d8475055ba8e5f5c2` | manifesto passou a abrir `app-shell.html` |
| 2026-08-03 | Renovação do cache | commit `0b3ff2da3ecad020abb2294dbb616df132b874ff` | cache atualizado para `calculaae-install-flow-5` |
| 2026-08-03 | Testes de regressão | commits `3d10deb5d5ca9e7009e7affe1227b4002a1bc26f`, `1bed951029fd8fee3df28a5a06852e7fe4d98845`, `4211f938f530cf68fd831c250d725e050790379b` e `870066f67a1016b32d5d35510a25f91eea813926` | contrato de abertura standalone incluído na verificação |
| 2026-08-03 | Progresso e aprendizados | commits `3f65e0a83680fb79b7a4391b2ddcfdb7f8094e28`, `6b9ec816f990bc9c0a3d12b488996bab9486c48e` e `01d678bcb1cac5c358fdc610af8ec407c8633a57` | regras distribuídas entre `AGENTS.md`, `SKILLS.md` e `PWA_RULES.md` |
| 2026-08-03 | Planos de produto | commits `5b3d9d07dcfa3f1aa79d25207c9f1d8b60dcca95`, `6ab43efecb01d7fbc403f1a2afeae488eaa86b47` e `e033b0a041f4c5edb05e711795655979256ad831` | plano ativo preservado e registrado |
| 2026-08-03 | Validação física final do PWA | confirmação do proprietário no Android, deploy `6a710c5830b5fe00085ea689` | instalação aprovada e duas aberturas pelo ícone sem piscada |

## Ainda não confirmado

- Fluxo completo no iPhone/Safari.
- Não há CI associada à branch. A verificação ampla não rodou na cópia isolada porque ela não continha o `app.js` completo; os testes focados passaram e o build do Netlify terminou sem erro.
- Nenhum bloco de interface do Plano 01 foi implementado ou validado no celular.

## Próximo passo único

Iniciar o **Bloco 0 — Referência e proteção da base** do Plano 01, sem alterar ainda a interface.

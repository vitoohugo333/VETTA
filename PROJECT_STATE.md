# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03  
**Estado:** PWA validado no Android; Bloco 0 concluído; teste remoto econômico preparado na branch de validação.  
**Alteração em curso:** nenhuma no aplicativo; ativação do botão manual do GitHub Actions e cadastro do segredo de teste ainda pendentes.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch ativa de desenvolvimento e validação | `netlify/teste-fechado` |
| Site ligado à branch | `calculaae.netlify.app` |
| Fotografia funcional validada no Android | `0b3ff2da3ecad020abb2294dbb616df132b874ff` |
| Relatório do Bloco 0 | `docs/planos/01-BLOCO-0-REFERENCIA-E-PROTECAO-DA-BASE.md` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
| Branch histórica permanente | `migration/vetta-clean-3-5-1` |
| Teste remoto preparado | `tests/e2e-remote/usage-gate.spec.js` |
| Workflow preparado | `.github/workflows/test-usage-manual.yml` |
| `main` | protegida e não alterada; `2a42c39612ec161bf58f16bbbbbd26521f28d30a` |

## Decisões explícitas do proprietário

- O desenvolvimento continuará na própria `netlify/teste-fechado`.
- Cada commit nessa branch pode atualizar automaticamente `calculaae.netlify.app`.
- `migration/vetta-clean-3-5-1` é uma referência histórica permanente e nunca deve ser excluída.
- A PR #1 deve permanecer aberta e intocada até nova decisão.
- Não será criada uma segunda credencial de acesso neste momento.
- O teste automatizado deve priorizar custo-benefício, gratuidade e estabilidade.
- Não deve rodar em todo commit nem consumir recursos sem necessidade.
- `main`, cálculos, dados, PWA funcional e interface permanecem protegidos.

## Teste remoto econômico — preparado agora

Foi criada uma única execução Playwright para o site publicado, usando somente Chromium e uma máquina Linux.

O cenário:

1. confirma que manifesto, service worker e ícones continuam públicos;
2. confirma que o site comum continua protegido por senha;
3. autentica com uma credencial existente;
4. usa `forceBrowser=1` para provar que o navegador comum continua vendo a instalação e não a interface interna;
5. abre novamente sem `forceBrowser`, permitindo o acesso apenas porque o navegador informa `navigator.webdriver`;
6. testa digitação, navegação, botão voltar e preservação dos campos;
7. falha se ocorrer erro JavaScript não tratado.

### Proteções de custo

- acionamento somente manual;
- um Chromium;
- um trabalhador;
- nenhuma repetição automática;
- limite máximo de oito minutos;
- vídeo desligado;
- captura e trace somente em falha;
- evidência retida por um dia;
- nova execução cancela outra igual ainda em andamento.

## Estado da ativação

### Confirmado

- `playwright.config.js` possui modo remoto ativado somente quando `VETTA_TEST_BASE_URL` existe.
- `tests/e2e-remote/usage-gate.spec.js` contém o cenário contínuo de barreira e uso interno.
- `.github/workflows/test-usage-manual.yml` contém apenas `workflow_dispatch`; não há `push` nem agendamento.
- `tests/README.md` documenta operação, custo, senha e limites da prova.
- `SKILLS.md` obriga os próximos agentes a ler essas regras antes de criar ou ampliar automação.
- `PWA_RULES.md` registra como testar o interior sem burlar a instalação obrigatória.
- `INC-0003` preserva o aprendizado para outros PWAs e aplicações web.
- a sintaxe dos arquivos JavaScript novos e alterados passou em `node --check` numa cópia isolada;
- a estrutura econômica do workflow foi verificada: Linux, oito minutos, Chromium único, falha-only e retenção de um dia.

### Ainda não ativado

- o GitHub só permite acionar manualmente um workflow quando o arquivo também existe na branch padrão;
- o workflow está preparado em `netlify/teste-fechado`, mas não foi adicionado à `main` porque essa branch exige autorização expressa separada citando o alvo;
- o segredo `VETTA_TEST_PASSWORD` ainda precisa ser cadastrado nas configurações do GitHub usando uma senha já existente;
- o conector GitHub atual não oferece operação de criação de segredos;
- por essas duas razões, o navegador remoto ainda não foi executado contra o site real.

## Aplicativo e validação física

- O botão de instalação abriu a janela nativa do Android.
- O PWA foi instalado e abriu pelo ícone sem mostrar a tela de instalação.
- A validação física do PWA no Android está concluída.
- Nenhum arquivo funcional do aplicativo, cálculo, dado, interface, manifesto, service worker ou cache foi alterado neste bloco.
- Não é necessária nova validação física para esta infraestrutura de testes.
- O fluxo completo no iPhone/Safari continua não confirmado.

## Branches e PR

Continuam existindo seis branches remotas:

| Branch | Situação confirmada |
|---|---|
| `main` | produção protegida; permanece intocada |
| `netlify/teste-fechado` | branch ativa e mais nova |
| `migration/vetta-clean-3-5-1` | referência permanente; cabeça da PR #1 |
| `feature/bloco-1-navegacao-secundaria` | superada; exclusão anteriormente autorizada, mas ainda pendente |
| `tmp/pwa-gate-apply` | superada; exclusão anteriormente autorizada, mas ainda pendente |
| `tmp/pwa-gate-apply-2` | superada; exclusão anteriormente autorizada, mas ainda pendente |

A PR #1 continua aberta em rascunho, sem merge, com base em `main` e cabeça em `migration/vetta-clean-3-5-1`.

## Aprendizado do bloco

**Aprendizado fechado:** automação de navegador e prova de instalação devem ser tratadas como evidências separadas.

O robô só pode entrar pelo caminho interno quando existir uma característica inequívoca de automação, enquanto a mesma execução prova que o navegador comum continua protegido e preso à instalação. A regra está em `PWA_RULES.md`; o histórico está em `INC-0003`; a prova executável está em `tests/e2e-remote/usage-gate.spec.js`.

## Próximo passo único — ativação mínima do teste manual

Autorizar expressamente um bloco limitado à `main` para adicionar **somente** `.github/workflows/test-usage-manual.yml`, sem copiar aplicativo, testes de produto, interface, cálculos ou dados para essa branch; depois cadastrar manualmente o segredo `VETTA_TEST_PASSWORD` nas configurações do GitHub e executar o workflow escolhendo a branch `netlify/teste-fechado`.

Resultado esperado: o agente poderá iniciar sob demanda o navegador virtual no site real, sem execução automática e sem retirar a instalação obrigatória.

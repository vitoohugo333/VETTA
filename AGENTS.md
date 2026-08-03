# VETTA — regras obrigatórias do projeto

O VETTA ajuda motoristas de aplicativo a planejar, registrar e entender o próprio resultado financeiro. Deve ser simples no celular, confiável nos números e local-first.

## Regra central sobre branches

Os arquivos do repositório pertencem à branch onde estão. `AGENTS.md`, `SKILLS.md` e `PROJECT_STATE.md` não são automaticamente globais.

A `main` funciona como branch protegida de controle, governança e acionamento manual de workflows. Ela não é a fonte atual do aplicativo.

Antes de qualquer trabalho técnico:

1. identificar a branch realmente afetada;
2. ler `AGENTS.md`, `SKILLS.md`, arquivos operacionais aplicáveis e `PROJECT_STATE.md` daquela branch;
3. confirmar a ponta atual da branch, PR, CI e ambiente servido quando forem relevantes;
4. nunca usar os arquivos da `main` como substitutos dos arquivos da branch-alvo.

O workflow manual existente na `main` pode executar outra branch escolhida. Nesse caso, o código e os testes usados são os da branch selecionada, não os da `main`.

## Hierarquia de verdade

1. ordem explícita mais recente do proprietário;
2. `AGENTS.md` da branch-alvo;
3. `SKILLS.md` e arquivos operacionais da branch-alvo;
4. fontes vivas atuais: GitHub, PR, CI, Netlify, GitHub Pages e site servido;
5. `PROJECT_STATE.md` da branch-alvo;
6. memória do chat, resumos e capturas, apenas como contexto auxiliar.

Todo fato variável deve ser confirmado na fonte atual. Se não puder ser confirmado, declarar **não confirmado** e explicar o impacto.

## Uso obrigatório do Codex Engineering Guardrails

- diagnóstico, auditoria ou revisão sem alteração: usar `code-verification`;
- mudança autorizada: usar `code-work`, do recorte à verificação final;
- nunca substituir evidência por suposição.

## Uso obrigatório do GitHub

Para repositório, branches, commits, PRs, CI e publicação, usar o conector GitHub como fonte remota primária. Ferramentas locais só podem preencher lacunas reais do conector e devem permanecer alinhadas ao remoto.

## Trabalho por blocos

Uma autorização cobre o bloco técnico diretamente necessário para entregar o resultado aprovado, incluindo testes e ajustes pequenos indispensáveis.

Parar e pedir nova decisão apenas se surgir:

- mudança de objetivo;
- área fora do contrato;
- risco novo para dados, cálculos, interface, PWA, acesso ou publicação;
- alteração não autorizada em `main`, merge, tag, release, credenciais ou ação destrutiva.

## Política atual de branches e ambientes

- `main`: controle e governança; protegida; não contém a versão atual do aplicativo.
- `netlify/teste-fechado`: versão estável dos testadores e fonte de `calculaae.netlify.app`.
- `netlify/teste-fechado-ux`: desenvolvimento e validação manual da reorganização de interface.
- `migration/vetta-clean-3-5-1`: referência histórica permanente e cabeça da PR #1.
- branches antigas ou temporárias não devem ser reutilizadas sem apuração e ordem explícita.

Nenhuma mudança da branch UX pode ser copiada, mesclada ou publicada na branch estável, na `main` ou no Netlify sem autorização específica posterior.

## Custo-benefício obrigatório

Preferir a solução mais simples e gratuita que entregue evidência suficiente.

Automação de navegador deve:

- rodar somente quando necessária;
- usar, por padrão, uma máquina Linux e um Chromium;
- evitar execução em todo commit, matrizes, vídeos permanentes e emuladores sem necessidade comprovada;
- guardar evidências somente em falha e pelo menor tempo útil.

## Segurança e escopo

- uma mudança observável por vez;
- sem refatoração ou limpeza paralela;
- nunca expor senha, token ou segredo em arquivo, log ou comentário;
- não sobrescrever trabalho remoto ou local preexistente;
- mudanças de interface ou PWA exigem validação física no celular;
- valores financeiros exigem testes determinísticos independentes da interface;
- não declarar “funcionando”, “CI passou” ou “publicado” sem evidência fresca.

## Comunicação

Falar com o proprietário como leigo em programação: didático, direto e curto.

Sempre explicar:

- onde está cada estado;
- qual é o mais novo;
- o que mudou;
- o efeito prático;
- o que permaneceu intocado;
- o próximo passo único.

Commit é uma fotografia salva do projeto, não um número de versão crescente.

## Formato de entrega para trabalho técnico

- Modo executado:
- Objetivo aprovado:
- Repositório, branch e atualização:
- Estado explicado:
- Arquivos alterados:
- Evidência e testes:
- Site de validação:
- Ainda não validado no celular:
- `main` e publicação foram alterados?:
- Próximo passo único:

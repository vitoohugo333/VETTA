# VETTA — regras obrigatórias do projeto

O VETTA ajuda motoristas de aplicativo a planejar, registrar e entender o próprio resultado financeiro. Ele deve ser simples no celular, confiável nos números e local-first.

## Hierarquia de verdade

1. Ordem explícita mais recente do proprietário.
2. Este `AGENTS.md`: regras permanentes do projeto.
3. `PROJECT_STATE.md`: estado atual e próximo passo.
4. Evidência fresca do repositório, CI e artefato publicado.
5. Memória do chat: apenas contexto auxiliar; nunca substitui os itens acima.

Branch, commit, SHA, ambiente publicado, fase e pendências pertencem ao `PROJECT_STATE.md`, nunca a este arquivo.

## Modos de trabalho

- **Diagnóstico:** somente leitura. Não editar, publicar, criar commit nem propor refatoração como parte da execução.
- **Contrato:** definir o recorte e aguardar aprovação.
- **Implementação:** alterar somente o contrato aprovado.
- **Verificação:** testar e reportar evidência, sem ampliar o escopo.
- **Publicação:** somente com autorização explícita e separada.
- **Checkpoint:** registrar o estado no `PROJECT_STATE.md` após a validação física do proprietário.

## Antes de qualquer alteração

1. Ler integralmente este arquivo e `PROJECT_STATE.md`.
2. Confirmar e reportar: repositório e branch; `git status`, incluindo alterações locais preexistentes; commit atual; SHA publicado no site de validação, quando existir; entrada correspondente no `PROJECT_STATE.md`; e arquivos previstos.
3. Apresentar um contrato curto: objetivo observável, arquivos previstos, o que não pode mudar, critério de aceite e teste.
4. Aguardar autorização explícita do proprietário antes de tocar em interface, PWA, armazenamento, navegação, arquitetura, cálculos, build ou publicação.

Nunca sobrescrever, descartar ou incorporar alterações locais preexistentes sem ordem explícita.

## Aprovação

- Aprovação de investigação não autoriza alteração.
- Aprovação de alteração não autoriza commit, push, PR, tag, deploy ou publicação.
- Aprovação de publicação deve citar expressamente o commit a publicar.
- Se a causa exigir arquivo ou área não prevista no contrato, parar, explicar e pedir novo aceite.

## Escopo e segurança

- Uma mudança observável por vez.
- Sem refatoração, limpeza, modernização ou melhoria paralela.
- Sem criar branch, PR, commit, push, tag, deploy, publicação ou alteração em `main` sem autorização explícita.
- Se o pedido exigir duas áreas relevantes, divergir do site validado ou indicar risco de remendo, parar e pedir decisão.
- Nunca afirmar “corrigido”, “publicado” ou “funcionando” sem evidência fresca.

## Limite de branches

No máximo quatro branches remotas ativas. Seus papéis, nomes e situação atual devem estar definidos no `PROJECT_STATE.md`.

Versões aprovadas são preservadas por tags (`vX.Y.Z`), não por branches acumuladas.

## Checkpoint de validação

O `PROJECT_STATE.md` pode ser atualizado no início de uma alteração para registrar “em curso” ou “aguardando validação”. Após o teste no celular, registrar:

- data;
- branch e commit testado;
- SHA efetivamente servido pelo site de validação, quando aplicável;
- comportamento testado;
- resultado;
- pendência real;
- próximo passo único.

Enquanto não houver teste no celular, declarar claramente: **aguardando validação física**.

## Evidência mínima

- Não inferir o ambiente publicado apenas pela branch.
- Não declarar paridade entre branch e site de validação sem comparar os SHAs.
- Não declarar correção por leitura de código: apresentar teste, reprodução ou evidência direta proporcional ao risco.
- Não chamar falha de “pré-existente” sem evidência.

## Direção técnica mínima

Não construir agora sistema de plugins, backend, login, sincronização, pagamento, manifestos, eventos ou feature flags.

Ao consolidar o app, manter quatro limites claros: cálculos puros, dados versionados, telas/áreas e navegação. Isso permite crescer depois sem antecipar uma plataforma grande.

## Critérios de qualidade

- Valores financeiros precisam de testes determinísticos e independentes da interface.
- Custos estimados e reais precisam estar identificados de forma inequívoca.
- Atualizações não podem apagar registros existentes.
- Toda mudança de interface/PWA precisa de validação manual no celular.

## Formato obrigatório de entrega

- Modo executado:
- Objetivo aprovado:
- Branch e commit:
- Arquivos alterados:
- Evidência e testes:
- SHA do site de validação:
- Ainda não validado no celular:
- `main` e publicação foram alterados?:
- Próximo passo único:

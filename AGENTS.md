# VETTA — regras obrigatórias do projeto

O VETTA ajuda motoristas de aplicativo a planejar, registrar e entender o próprio resultado financeiro. Ele deve ser simples no celular, confiável nos números e local-first.

## Hierarquia de verdade

1. Ordem explícita mais recente do proprietário.
2. Este `AGENTS.md`: regras permanentes do projeto.
3. `PROJECT_STATE.md`: estado atual e próximo passo.
4. Evidência fresca do repositório, CI e artefato publicado.
5. Memória do chat: apenas contexto auxiliar; nunca substitui os itens acima.

Branch, commit, SHA, ambiente publicado, fase e pendências pertencem ao `PROJECT_STATE.md`, nunca a este arquivo.

## Uso obrigatório do Codex Engineering Guardrails

O Codex Engineering Guardrails deve ser usado durante todo o trabalho no VETTA. Ele não é opcional nem uma etapa isolada: orienta o diagnóstico, o contrato, a implementação e a verificação para manter cada ação direcionada, com escopo controlado e evidência fresca.

- Antes de agir, carregar e seguir a habilidade aplicável do Codex Engineering Guardrails.
- Em diagnóstico, auditoria ou revisão sem alteração, usar `code-verification`.
- Em mudança autorizada, usar `code-work` do contrato à verificação final.
- Se a habilidade não estiver disponível, declarar isso antes de continuar e aplicar estas regras do projeto como limite mínimo; nunca substituir a verificação por suposição.

## Protocolo obrigatório de identidade do ambiente e apuração integral antes de decidir

Antes de qualquer diagnóstico, contrato, alteração, conclusão ou resposta factual sobre o VETTA, realizar uma apuração completa, atual e proporcional ao risco nas fontes vivas relevantes. O objetivo é antecipar dependências e erros de ponta a ponta antes de tomar uma decisão; não descobrir obstáculos importantes depois de começar.

Nunca decidir com base apenas em memória do chat, resumo anterior, `PROJECT_STATE.md`, captura de tela ou checagem antiga. Esses itens registram contexto e evidência histórica, mas não provam o estado atual.

### Fontes de verdade e validade

- A ordem explícita mais recente do proprietário define o que deve ser feito.
- Para repositório, branches, commits, PRs, CI e publicação, o conector GitHub é a fonte remota primária de confirmação.
- Para o ambiente de validação, confirmar a configuração atual do GitHub Pages e o conteúdo efetivamente servido pela URL. A configuração de uma branch, sozinha, não prova que o deploy já terminou.
- `AGENTS.md` contém regras permanentes; `PROJECT_STATE.md` contém o estado vivo de trabalho; ambos podem ficar desatualizados e devem ser confrontados com as fontes vivas antes de orientar uma decisão.
- Memória, resumos e capturas de tela são contexto ou evidência de um momento específico; nunca substituem uma consulta atual quando o fato pode ter mudado.

Todo fato variável deve ser tratado com três informações: **fonte**, **momento da checagem** e **validade**. “Confirmado antes” significa apenas “era verdadeiro naquele momento”; nunca “continua verdadeiro agora”. Se a fonte atual não puder ser consultada, declarar **não confirmado**, explicar a consequência e não preencher a lacuna com suposição.

### Levantamento obrigatório

Antes de qualquer diagnóstico, contrato, alteração ou afirmação sobre o VETTA:

1. Localizar e ler o `AGENTS.md` remoto aplicável antes de usar memória do chat ou arquivos locais.
2. Confirmar pelo GitHub o repositório, a branch relevante, o commit atual e o PR relacionado, quando existir: base, cabeça, estado, diff e CI.
3. Ler o `PROJECT_STATE.md` da branch já confirmada e separar o que ele registra do que foi confirmado agora.
4. Se houver cópia Git local, confirmar raiz do repositório, remoto `origin`, branch, commit, relação com a ponta remota e `git status`, incluindo alterações locais preexistentes.
5. Conferir workflows, testes, configurações, importações e arquivos consumidores que podem ser afetados pelo trabalho pretendido.
6. Quando houver ambiente de validação, confirmar URL, branch e pasta configuradas no GitHub Pages; obter a ponta atual dessa branch; e comparar o conteúdo servido com o commit esperado quando isso for necessário para a decisão.
7. Identificar os impactos possíveis em dados existentes, interface, cálculos, PWA, navegação, build, CI e publicação.

Arquivos soltos em uma pasta nunca provam o estado do VETTA no GitHub. Se não houver repositório Git local quando a tarefa exigir Git, se o `origin` não for o repositório esperado, ou se houver uma divergência que impeça saber qual conteúdo será alterado ou testado, parar e explicar. Nesse caso, atuar somente em diagnóstico até o proprietário decidir como prosseguir: não criar commit, PR, branch, push, deploy ou publicação.

### Mapa completo antes de alterar

Antes de propor uma alteração, mapear o caminho completo até a validação no celular:

1. origem e destino exatos;
2. resultado observável que o proprietário verá;
3. arquivos e áreas afetadas, com o que deve permanecer intocado;
4. dependências previsíveis, configurações, testes, workflows e serviços envolvidos;
5. riscos para dados, interface, cálculos, PWA, build, CI e publicação;
6. testes locais, CI remota, ambiente de validação e prova final necessários.

Dependências previsíveis devem aparecer no contrato inicial. Não é aceitável propor “alterar só um arquivo” sem antes verificar que configurações, testes ou consumidores obrigatórios também precisam ser considerados. Se a apuração revelar área fora do contrato, risco de remendo ou divergência com o site validado, parar, explicar em linguagem simples e pedir nova decisão.

Antes de agir, separar explicitamente no relatório:

- **confirmado agora**: fonte atual e o que ela prova;
- **histórico/documentado**: informação registrada, que pode estar velha;
- **informado pelo proprietário**: preferência, intenção ou validação pessoal que não deve ser reinterpretada como fato técnico;
- **pendente de confirmação**: o que falta, por que importa e qual fonte pode confirmar.

## Modos de trabalho

- **Diagnóstico:** somente leitura. Não editar, publicar, criar commit nem propor refatoração como parte da execução.
- **Contrato:** definir o recorte e aguardar aprovação.
- **Implementação:** alterar somente o contrato aprovado.
- **Verificação:** testar e reportar evidência, sem ampliar o escopo.
- **Publicação:** somente com autorização explícita e separada.
- **Checkpoint:** registrar o estado no `PROJECT_STATE.md` após a validação física do proprietário.

## Antes de qualquer alteração

Após concluir o Protocolo obrigatório de identidade do ambiente:

1. Ler integralmente este arquivo e `PROJECT_STATE.md` da branch confirmada.
2. Confirmar e reportar repositório, branch, `git status` incluindo alterações locais preexistentes, commit atual, estado remoto, SHA publicado no site de validação quando existir, entrada correspondente no `PROJECT_STATE.md` e arquivos previstos.
3. Informar qualquer divergência encontrada.
4. Apresentar um contrato curto: objetivo observável, arquivos previstos, o que não pode mudar, critério de aceite e teste.
5. Aguardar autorização explícita do proprietário antes de tocar em interface, PWA, armazenamento, navegação, arquitetura, cálculos, build ou publicação.

Nunca sobrescrever, descartar ou incorporar alterações locais preexistentes sem ordem explícita.

## Aprovação

- Aprovação de investigação não autoriza alteração.
- Aprovação de alteração não autoriza commit, push, PR, tag, deploy ou publicação.
- Aprovação de publicação deve citar expressamente o commit, PR ou alvo a publicar.
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

## Declarações verificáveis

Só afirmar “commit criado”, “publicado”, “CI passou”, “site atualizado” ou “branch igual ao site” com evidência recente e identificável.

A evidência deve citar, conforme o caso, SHA do commit, branch, resultado da CI, URL ou SHA efetivamente servido e confirmação do conector GitHub. Sem essa evidência, declarar: **não confirmado**.

## Comunicação clara para o proprietário

Falar com o proprietário como leigo em programação: de forma didática, direta e curta, explicando qualquer termo técnico necessário antes de usá-lo como conclusão.

- Nunca apresentar somente códigos técnicos, como `aa58e4d`, SHA, nome de branch ou resultado de CI. Traduzir sempre: onde está, se é o estado mais novo ou anterior, o que mudou e qual é o efeito prático.
- Não usar metáforas mecânicas nem apresentar um commit como número de versão. Primeiro dizer, em linguagem simples, se o GitHub tem uma atualização mais nova ou anterior, o que ela mudou e qual é o efeito prático. Só explicar que “commit” é o registro técnico dessa atualização se isso ajudar a decisão.
- Ao reportar divergência, usar uma tabela simples com: cópia local, GitHub, site de validação, qual está mais novo, diferença prática e o que permanece intocado.
- Dizer “não confirmado” quando a informação não tiver prova atual; nunca transformar incerteza técnica em certeza para simplificar a resposta.
- O relatório deve responder primeiro ao que importa para o proprietário: o que está acontecendo, o que muda, o que não muda, o que foi provado e qual é o próximo passo único.

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
- Estado explicado: (em linguagem simples: local, GitHub, site e qual está mais novo)
- Arquivos alterados:
- Evidência e testes:
- SHA do site de validação:
- Ainda não validado no celular:
- `main` e publicação foram alterados?:
- Próximo passo único:

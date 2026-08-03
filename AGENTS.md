# VETTA — regras obrigatórias do projeto

O VETTA ajuda motoristas de aplicativo a planejar, registrar e entender o próprio resultado financeiro. Ele deve ser simples no celular, confiável nos números e local-first.

## Princípio de trabalho

Trabalhar de forma objetiva: primeiro entregar a conclusão e o efeito prático; depois, apenas o detalhe técnico necessário. A cautela deve crescer com o risco da ação — não com o tamanho da conversa.

Não transformar perguntas simples, explicações ou pequenas consultas de status em uma sequência de autorizações. Fazer a apuração necessária e responder de forma conclusiva.

## Trabalho por blocos de ação

Quando o proprietário autorizar um trabalho, executar um **bloco de ação completo**: o conjunto de etapas diretamente necessárias para entregar um resultado verificável. Um bloco normalmente inclui entender o estado relevante, fazer a alteração aprovada, rodar as verificações proporcionais e apresentar o resultado final.

O bloco não é medido por minutos. Ele deve ter começo, fim e objetivo claro, grande o bastante para evitar pedidos de autorização a cada microetapa e pequeno o bastante para não misturar objetivos diferentes.

- Uma autorização para um bloco cobre as etapas técnicas previsíveis e diretamente ligadas a ele, inclusive testes e correções pequenas descobertas durante a execução que sejam necessárias para o resultado aprovado.
- Não interromper o bloco apenas para confirmar comandos, leituras, testes, ajustes documentais previstos ou outras etapas rotineiras.
- Parar e pedir nova decisão somente se aparecer mudança de objetivo, arquivo ou área fora do combinado, risco novo para dados, cálculos, interface, PWA, `main`, publicação ou uma escolha do proprietário.
- Ao iniciar, dizer em poucas linhas o resultado esperado, o limite do bloco e o que ficará intocado. Ao terminar, entregar a conclusão, a evidência e a pendência real — sem transformar cada passo interno em uma nova conversa.

## Atualizações durante operações longas

Para evitar que o proprietário fique sem saber se o trabalho travou:

- enviar um checkpoint curto após cada etapa relevante ou, em média, após duas ou três chamadas de ferramenta;
- informar o que já foi confirmado, o que está sendo feito e o que falta;
- declarar imediatamente qualquer desvio, erro de ferramenta ou arquivo temporário criado;
- nunca ficar executando uma sequência longa de alterações sem atualização visível;
- se uma operação for interrompida, ao retomar informar exatamente qual foi a última alteração efetiva e o que ainda não entrou na branch.

## Hierarquia de verdade

1. Ordem explícita mais recente do proprietário.
2. Este `AGENTS.md`: regras permanentes.
3. Fontes vivas atuais: GitHub, PR, CI e site de validação, quando forem relevantes.
4. `PROJECT_STATE.md`: registro de trabalho, que pode estar desatualizado.
5. Memória do chat, resumos e capturas: apenas contexto auxiliar.

Para repositório, branches, PRs, CI e publicação, usar o conector GitHub como fonte remota principal. Nunca tratar uma checagem antiga como prova atual. Se algo importante não puder ser confirmado, dizer **não confirmado**, explicar o impacto e não inventar certeza.

## Arquivos operacionais obrigatórios

- Antes de qualquer alteração em instalação, manifesto, service worker, cache, ícones, modo standalone ou publicação do PWA, ler também `PWA_RULES.md`.
- Erros recorrentes devem virar regra preventiva no arquivo operacional correspondente, não permanecer apenas no chat.
- `PROJECT_STATE.md` registra o estado e a evidência; arquivos de regras registram como evitar repetição do erro.

## Uso obrigatório do Codex Engineering Guardrails

- Diagnóstico, auditoria ou revisão sem alteração: usar `code-verification`.
- Mudança autorizada: usar `code-work`, do recorte à verificação final.
- Se a habilidade não estiver disponível, declarar isso e seguir estas regras como limite mínimo. Nunca trocar evidência por suposição.

## Níveis de trabalho

### 1. Conversa, explicação, estratégia ou decisão

Responder diretamente. Não exigir contrato, status completo do GitHub nem autorização para explicar algo. Se a resposta depender de um fato atual, consultar apenas a fonte necessária.

### 2. Status do projeto ou dúvida sobre GitHub

Fazer uma checagem atual e objetiva do que muda a resposta: repositório, branch, PR, CI ou site, conforme o caso. Informar onde está o estado mais novo, o efeito prático e a pendência real. Não repetir dados que não ajudam a decisão.

### 3. Mudança documental ou de baixo risco

Definir em uma frase o resultado, os arquivos e o que ficará intocado; com autorização explícita, executar e verificar em uma única etapa. Não criar commit, enviar ao GitHub, abrir PR ou publicar sem autorização específica.

### 4. Mudança no app, dados, cálculos, interface, PWA ou navegação

Antes de editar, confirmar de forma proporcional: repositório e branch corretos, alterações locais já existentes, arquivos consumidores, testes e impacto em dados, interface, cálculos, build, CI e publicação. Apresentar um contrato curto e aguardar autorização explícita.

Mudanças de interface ou PWA exigem validação manual no celular. Valores financeiros exigem testes determinísticos e independentes da interface. Atualizações não podem apagar registros existentes.

### 5. Merge, publicação, deploy ou alteração em `main`

Exigem autorização explícita e separada, citando o alvo. Antes de executar, confirmar a versão correta, CI aplicável e o ambiente que será afetado. Não declarar publicado ou igual ao site sem evidência atual.

## Regras de segurança e escopo

- Uma mudança observável por vez.
- Não sobrescrever, descartar ou incorporar alterações locais preexistentes sem ordem explícita.
- Sem refatoração, limpeza ou melhoria paralela fora do objetivo aprovado.
- Se surgir uma área não prevista que mude risco, dados, interface, cálculos ou publicação, parar, explicar a decisão necessária e pedir novo aceite.
- No máximo quatro branches remotas ativas; seus papéis e situação devem constar no `PROJECT_STATE.md`.
- Não construir agora plugins, backend, login, sincronização, pagamento, manifestos, eventos ou feature flags.

Ao consolidar o app, manter quatro limites claros: cálculos puros, dados versionados, telas/áreas e navegação.

## GitHub Pages nesta operação

- Quando o GitHub Pages estiver configurado para servir a branch de trabalho, atualizar essa branch já atualiza automaticamente o site de validação. Não tratar isso como uma etapa manual separada de publicação.
- Mesmo assim, após a atualização da branch, confirmar que o conteúdo servido corresponde à nova fotografia antes de afirmar que o site foi atualizado.

## Evidência e checkpoint

- Não afirmar “corrigido”, “funcionando”, “CI passou”, “site atualizado” ou “publicado” sem evidência recente e identificável.
- Para o GitHub Pages, configuração de branch não basta: quando necessário, comparar o conteúdo servido com a versão esperada.
- Após validação no celular, registrar no `PROJECT_STATE.md`: data, branch e atualização testada, site/SHA quando aplicável, comportamento testado, resultado, pendência real e próximo passo único.
- Antes disso, usar **aguardando validação física**.

## Comunicação com o proprietário

Falar como para leigo em programação: didático, direto e curto.

- Começar por: o que está acontecendo, o que muda, o que não muda e qual é o próximo passo.
- Só explicar termos técnicos se eles ajudarem a decidir. Nunca despejar códigos, nome de branch, SHA ou resultado de CI sem traduzir.
- Quando houver divergência relevante, usar uma tabela simples com cópia local, GitHub, site de validação, qual está mais novo, diferença prática e próximo passo.
- Em vez de linguagem mecânica, dizer de forma natural: “o GitHub tem uma atualização mais recente que esta cópia; ela mudou X; para editar sem risco, preciso usar essa versão”.
- Usar o formato completo de entrega apenas em mudanças, verificações ou publicações. Para conversa e explicação, responder normalmente.

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

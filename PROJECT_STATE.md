# Estado oficial — VETTA (`refatoracao-360-ux`)

**Atualizado em:** 2026-08-07, horário de Brasília  
**Estado:** nova Refatoração 360 criada do zero; preparação de governança concluída; nenhuma mudança funcional aplicada ainda.  
**Objetivo:** reconstruir a experiência do VETTA de ponta a ponta como um copiloto financeiro humano, autoguiado, responsivo e premium, preservando os cálculos e os dados.

## Identificação viva

| Item | Estado atual |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `refatoracao-360-ux` |
| Origem confirmada | `netlify/teste-fechado-ux` |
| Fotografia funcional de origem | `6594c98eb78b7eda67dbdde6ddcc841836bb6f3d` |
| Relação com a origem no nascimento | idêntica, `0` commits de diferença |
| Papel | experimento limpo de UI/UX |
| Ambiente pretendido/informado pelo proprietário | GitHub Pages — `https://vitoohugo333.github.io/VETTA/` |
| Política da branch | `ci/branch-policy.json` aponta GitHub Pages |
| SHA efetivamente servido pelo Pages | **não confirmado ainda nesta nova branch** |
| PR | nenhum |
| Netlify | fora desta operação; continua associado à linha estável dos testadores |

A nova branch foi recriada com o mesmo nome da experiência anterior, mas **não herda nenhum commit da implementação 360 apagada**. Ela nasceu diretamente da fotografia funcional `6594c98...` da `netlify/teste-fechado-ux`.

## Preparação antes do primeiro bloco funcional

Concluído:
- branch criada por autorização explícita do proprietário;
- política de CI alterada para identificar `refatoracao-360-ux`;
- GitHub Pages declarado como ambiente de validação esperado da branch;
- `AGENTS.md` sincronizado com a governança canônica atual da `main`;
- `SKILLS.md` sincronizado com a governança canônica atual da `main`;
- `TESTING_RULES.md`, `PWA_RULES.md`, `LEARNING_RULES.md` e `.skills/vetta-product-ux/SKILL.md` já eram iguais aos canônicos;
- `.github/workflows/ci-autonomous.yml` presente e chamando o motor canônico da `main`.

Ainda não feito:
- nenhuma mudança de interface;
- nenhuma mudança de cálculo;
- nenhuma mudança de armazenamento;
- nenhum merge;
- nenhuma alteração em `main`, `netlify/teste-fechado` ou Netlify;
- nenhuma afirmação de paridade do GitHub Pages sem prova do conteúdo servido.

## Por que a experiência anterior foi descartada

A validação física mostrou que a execução anterior organizou telas, mas não redesenhou suficientemente a experiência humana. Problemas observados:
- Planejamento/Meta perdeu importância e ficou difícil de encontrar;
- o aplicativo ainda exigia procura manual por funções;
- estados vazios não conduziam o usuário;
- registro, resultados, custos e planejamento não formavam um ciclo único;
- animações e microinterações eram genéricas;
- responsividade não foi tratada como sistema;
- CI validava estrutura e funcionamento, mas não a qualidade da jornada humana.

## Princípio central desta nova 360

O VETTA não deve ser um catálogo de funções. Deve guiar o motorista em um ciclo simples:

**planejar → trabalhar → registrar → administrar contas → acompanhar → ajustar**

Cada tela deve responder três perguntas sem exigir interpretação técnica:
1. **O que está acontecendo?**
2. **O que isso significa para meu dinheiro?**
3. **Qual é a próxima ação útil?**

## Contrato global de experiência

### Estados zerados e incompletos
Nenhuma tela importante pode terminar em silêncio.

Exemplos obrigatórios:
- meta = 0 → CTA dominante para definir meta;
- onboarding interrompido/incompleto → retomada contextual, sem bloquear uso desnecessariamente;
- nenhum registro → convite explícito para registrar o primeiro dia;
- nenhum custo → explicar por que cadastrar custos melhora a meta e oferecer cadastro;
- contas vencidas → prioridade sobre conteúdo secundário;
- nenhuma conta pendente → estado positivo e próximo passo coerente;
- mês novo → reorientação para plano, contas e primeiro registro;
- dados insuficientes para aprendizado/comparação → dizer o que falta e como produzir a evidência.

### Próxima ação
O VETTA deve derivar uma ação contextual do estado atual, sem obrigar o usuário a procurar manualmente o que fazer.

Prioridade inicial planejada:
1. completar plano/meta essencial;
2. resolver conta vencida ou atenção financeira crítica;
3. registrar dia quando necessário;
4. revisar ritmo do mês;
5. ajustar plano quando a realidade divergir;
6. manter continuidade quando tudo estiver coerente.

### Feedback e microinteração
- toque principal: resposta visual imediata;
- salvamento: confirmação curta, sem tela morta;
- pagamento: mudança de estado perceptível e reversível;
- progresso/meta: transição animada proporcional;
- erro: mensagem perto da causa e ação de recuperação;
- feedback háptico: melhoria progressiva somente quando o navegador/dispositivo suportar, nunca única forma de comunicar sucesso/erro;
- `prefers-reduced-motion`: sempre respeitado.

### Responsividade
A experiência será testada como composição, não só como largura:
- celular pequeno em retrato;
- celular grande;
- teclado virtual aberto;
- tablet;
- landscape;
- áreas seguras e barra inferior;
- toque com uma mão.

### Identidade
Preservar a identidade VETTA aprovada: tipografia, paleta, sofisticação visual, cards quando representarem uma unidade real, cantos e linguagem. A reformulação muda hierarquia, fluxo, comportamento e composição — não transforma o produto em outra marca.

## Referências de produto

Princípios absorvidos, sem copiar estética:
- **Revolut:** visão financeira consolidada próxima do Início; orçamento/análise como parte do núcleo financeiro;
- **Tesla:** estado atual + consequência + controle contextual na mesma superfície;
- **Duolingo:** próxima ação inequívoca, hábito separado de objetivo maior, progresso e celebração proporcionais ao marco;
- **Life360:** alertas contextuais/proativos em vez de exigir procura manual;
- **VETTA:** números confiáveis, consequência financeira clara e baixa carga mental para motorista de aplicativo.

## Blocos da nova Refatoração 360

### R1 — Agora + Plano do mês
Objetivo: tornar planejamento/meta parte de primeira classe da experiência.

Resultado esperado:
- plano do mês visível sem caça por menus;
- meta zero chama explicitamente para configuração;
- Agora mostra estado atual + plano + próxima ação;
- instalação do PWA não compete visualmente com tarefa financeira recorrente;
- Planejamento deixa de ser diretório e passa a contar uma sequência financeira coerente.

### R2 — Administração do mês
Objetivo: transformar Custos em administração financeira real.

Resultado esperado:
- contas vencidas, de hoje, próximas, pendentes e pagas claramente separadas;
- marcar/desmarcar pagamento;
- revisão do mês e impacto das despesas;
- reservas e custos operacionais visualmente distintos de contas a pagar;
- pagamento não remove custo da matemática.

### R3 — Registrar ↔ Resultados
Objetivo: fechar o ciclo entre trabalho realizado e consequência no plano.

Resultado esperado:
- registrar é rápido e mostra resultado antes de salvar;
- depois de salvar, usuário entende o que o dia mudou no mês;
- Resultados mostra ritmo, diferença para meta e ação sugerida;
- edição/atualização da mesma data continua segura;
- rascunho e contexto sobrevivem a navegação/interrupção quando aplicável.

### R4 — Autoguiado + Onboarding + estados
Objetivo: garantir que usuário nunca fique perdido.

Resultado esperado:
- onboarding produz um plano inicial compreensível;
- abandono do onboarding não deixa a Home muda;
- estados vazios/incompletos têm CTA;
- VETTA prioriza a próxima ação com base em estado real;
- mensagens explicam por que uma ação importa.

### R5 — Motion + háptico + responsividade + acabamento
Objetivo: transformar consistência funcional em experiência premium.

Resultado esperado:
- sistema de motion por significado;
- feedback háptico progressivo quando suportado;
- números e progresso mudam com transições legíveis;
- pagamentos/salvamentos têm feedback satisfatório sem exagero;
- telas adaptadas a celular/tablet/landscape;
- acessibilidade, foco, zoom, áreas de toque e movimento reduzido preservados.

## Invariantes

Não alterar sem novo contrato:
- fórmulas centrais e significado dos números;
- chave `vetta-driver-intelligence-v3`;
- registros existentes;
- lógica econômica de custos;
- `main`;
- `netlify/teste-fechado`;
- Netlify;
- merge, tag ou release.

Mudança de schema de dados somente se um comportamento aprovado realmente exigir persistência nova, com migração, compatibilidade, testes independentes e checkpoint específico.

## Estratégia de teste

Cada bloco deve ter:
- teste determinístico/contrato quando houver regra de estado;
- E2E móvel da tarefa principal;
- estados vazio/erro/interrupção relevantes;
- preservação de dados e cálculos;
- Chromium móvel e desktop;
- Firefox e WebKit para mudanças de UI/navegação;
- prova do GitHub Pages quando o ambiente estiver efetivamente servindo esta branch;
- validação física final do proprietário no celular.

A CI não deve apenas provar que elementos existem. Ela deve provar **descoberta, prioridade, continuidade e consequência da tarefa**.

## Governança de branches

Na checagem de criação existiam 5 branches remotas antes de recriar esta experiência, acima da estrutura planejada de 4. A criação desta branch foi autorizada explicitamente pelo proprietário. Nenhuma branch antiga foi apagada automaticamente. **Limpeza de branches permanece pendente de autorização destrutiva específica e não deve ser misturada à implementação de UX.**

## Notion

O bloco `Experimento — Refatoração 360 UX` deve registrar este reinício limpo e cada checkpoint R1→R5. O histórico da tentativa anterior deve permanecer como aprendizado, não como base técnica.

## Próximo passo único

Implementar **R1 — Agora + Plano do mês** sobre a fotografia funcional limpa, provar o fluxo e o GitHub Pages, registrar checkpoint e seguir automaticamente para R2 dentro da autorização atual.

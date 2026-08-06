# VETTA Product UX

## Finalidade

Esta skill governa qualquer diagnóstico, proposta, desenho, revisão ou alteração de experiência do VETTA. Ela prioriza a tarefa real do motorista, o fluxo completo, a segurança dos dados e a clareza dos números antes da aparência visual.

## Ordem de uso

1. Leia `AGENTS.md`, `SKILLS.md`, `TESTING_RULES.md`, regras especializadas e `PROJECT_STATE.md` da branch-alvo.
2. Confirme branch, fotografia salva, ambiente aplicável, PR e CI quando existirem.
3. Identifique a tarefa do usuário antes de propor tela, componente ou navegação.
4. Preserve cálculos, dados, armazenamento, PWA e identidade visual fora do contrato.

## Perguntas obrigatórias antes de desenhar ou alterar

- Quem está usando?
- Qual tarefa precisa concluir?
- Qual resultado observável confirma o fim da tarefa?
- Qual informação precisa aparecer primeiro?
- O que pode ficar em tela secundária?
- O que acontece ao salvar, voltar, cancelar, interromper ou repetir?
- Quais erros, vazios e estados intermediários existem?
- O que precisa ser testado automaticamente e no celular?

## Estrutura obrigatória da proposta

Toda proposta de UX deve declarar:

1. tarefa do usuário;
2. entrada do fluxo;
3. ação principal;
4. confirmação de sucesso;
5. edição e cancelamento;
6. comportamento ao voltar;
7. estados vazio, carregando, salvando, sucesso, erro e indisponível, quando aplicáveis;
8. dados e cálculos afetados ou preservados;
9. riscos para navegação, armazenamento, PWA e publicação;
10. testes automatizados e validação física necessários.

## Navegação canônica

A organização aprovada é:

`Agora | Registrar | Resultados | Custos | Mais`

- `Agora`: situação atual e próxima ação.
- `Registrar`: entrada rápida, resultado imediato e salvamento seguro.
- `Resultados`: interpretação, histórico e comparação.
- `Custos`: impacto financeiro de combustível, contas e reservas.
- `Mais`: planejamento, aplicativo, dados e funções secundárias.

Uma função só muda de área quando a pergunta do usuário justificar claramente a mudança.

## Regras de segurança da experiência

É proibido propor ou implementar solução que:

- apague campos ao trocar de tela;
- substitua ou duplique registros silenciosamente;
- salve dados incompletos sem aviso;
- altere cálculos como efeito colateral de mudança visual;
- esconda ação principal ou saída previsível;
- dependa apenas do texto da interface para validar matemática;
- force tarefa longa ou decisão complexa durante condução;
- mude estética, PWA, armazenamento ou navegação fora do contrato.

## Lógica mobile obrigatória

Considere sempre:

- tela pequena e orientação retrato;
- uso com uma mão;
- teclado aberto;
- botão voltar do Android;
- barra inferior e área segura;
- toque impreciso;
- interrupção e retomada;
- retorno pelo ícone do PWA;
- conteúdo essencial antes de detalhes.

## Clareza dos números

Todo valor relevante deve informar, quando aplicável:

- o que significa;
- de onde veio;
- qual período considera;
- se é real, médio ou projetado;
- por que mudou;
- qual ação o usuário pode tomar.

## Critério de aceite

Uma mudança de UX só pode ser declarada pronta quando:

- o fluxo principal e os caminhos de erro foram exercitados;
- dados existentes foram preservados;
- cálculos afetados têm teste determinístico independente da interface;
- a matriz de navegadores proporcional passou quando aplicável;
- o ambiente publicado foi verificado quando aplicável;
- alterações visuais ou de PWA permanecem `aguardando validação física` até teste do proprietário no celular.

## Limite de atuação

Esta skill orienta lógica de produto e experiência. Ela não autoriza alteração, commit, merge, publicação, mudança em `main`, cálculo, armazenamento, PWA ou identidade visual sem contrato e autorização aplicáveis.

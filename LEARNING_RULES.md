# Regras permanentes de aprendizado técnico

Este arquivo deve ser lido junto com `AGENTS.md` e `SKILLS.md` antes de encerrar qualquer bloco técnico que tenha revelado um defeito, uma quase falha ou um conhecimento reutilizável.

## Objetivo

Fazer com que cada problema relevante deixe o projeto e os próximos agentes mais preparados do que antes.

O aprendizado não se limita ao CalculaAê. Conhecimentos que possam evitar erros em outros PWAs, aplicações web ou projetos futuros também devem ser preservados.

## Princípio de equilíbrio

Este processo não pode virar burocracia nem liberar encerramentos sem prova.

- Não exigir nova autorização para documentar um aprendizado surgido dentro de um bloco já autorizado.
- Não interromper uma correção urgente para escrever documentação; primeiro mitigar o risco, depois fechar o aprendizado antes de encerrar o bloco.
- Não registrar todo erro pequeno.
- Não transformar hipótese em regra permanente.
- Não criar arquivos especializados vazios ou antecipar arquiteturas sem conhecimento confirmado.
- Manter os registros concisos, mas completos o suficiente para que outro agente entenda causa, prevenção e prova.

## Tipos de registro

### Incidente

Falha real que afetou ou poderia afetar comportamento, dados, cálculos, segurança, instalação, publicação ou experiência do usuário.

### Aprendizado preventivo

Conhecimento confirmado e relevante que merece ser preservado mesmo sem ter causado uma falha grave, especialmente quando é reutilizável em futuros aplicativos.

Os dois tipos usam o mesmo ciclo de aprendizado e ficam em `docs/incidents/`.

## Quando o registro é obrigatório

Criar um registro quando pelo menos uma destas condições ocorrer:

1. exigiu investigação relevante, uma tentativa séria ou várias tentativas para chegar à causa;
2. afetou ou poderia afetar dados, cálculos, armazenamento, migração, segurança ou privacidade;
3. afetou instalação, PWA, cache, autenticação, publicação, CI, branch ou ambiente servido;
4. apareceu apenas em aparelho real, navegador específico ou condição difícil de reproduzir;
5. revelou uma lacuna de teste ou uma falsa sensação de segurança;
6. consumiu tempo relevante ou apresentou sintomas enganosos;
7. poderia reaparecer em outra área do CalculaAê;
8. gerou conhecimento reutilizável em outros PWAs, aplicações web ou projetos futuros;
9. o proprietário pediu expressamente que o aprendizado fosse preservado.

## Quando não criar um registro completo

Normalmente não registrar:

- erro de digitação simples;
- ajuste visual óbvio sem causa ou risco reutilizável;
- falha transitória externa já compreendida e sem ação preventiva possível;
- hipótese ainda não confirmada;
- tentativa descartada que não produziu conhecimento relevante;
- detalhe de implementação que já está evidente no código e coberto por teste suficiente.

Se houver dúvida, priorizar o valor futuro do conhecimento, não o tamanho aparente do erro.

## Ciclo de Aprendizado Fechado

Um bloco com aprendizado relevante só está tecnicamente encerrado quando as etapas aplicáveis abaixo foram tratadas:

1. **Sintoma:** o que foi observado pelo usuário, teste ou monitoramento.
2. **Causa imediata:** qual mecanismo específico provocou o comportamento.
3. **Causa estrutural:** por que o projeto permitiu que o problema existisse.
4. **Falha de detecção:** por que testes, revisão ou processo não impediram a ocorrência.
5. **Correção ou decisão:** o que foi alterado ou decidido.
6. **Prevenção permanente:** qual regra reduz a chance de problemas iguais ou parecidos.
7. **Prova:** teste automatizado, inspeção independente, deploy ou validação física que demonstra o resultado.
8. **Alcance:** onde o aprendizado pode ser reutilizado.

## Classificação de alcance

Todo registro deve indicar uma destas classificações:

- **CalculaAê específico:** depende da arquitetura ou decisão deste produto.
- **PWA reutilizável:** aplicável a outros aplicativos instaláveis.
- **Aplicação web reutilizável:** aplicável a outros sistemas web.
- **Engenharia geral:** princípio válido para diferentes tipos de projeto.

Um mesmo registro pode ter mais de uma classificação.

## Onde guardar cada parte

- `docs/incidents/`: história completa, causa, tentativas materiais, prevenção e evidência.
- arquivo especializado, como `PWA_RULES.md`: regra operacional resumida e obrigatória daquela área.
- teste automatizado: prova executável contra regressão, quando viável.
- `SKILLS.md`: índice para localizar arquivos obrigatórios e áreas de conhecimento.
- `PROJECT_STATE.md`: apenas estado atual, evidência recente e pendência; não repetir toda a história.
- `AGENTS.md`: forma de trabalhar e limites de autoridade, não catálogo de bugs.

## Regra sobre testes

Quando for tecnicamente viável e proporcional, o aprendizado deve gerar um teste capaz de falhar se o problema reaparecer.

Se não houver teste automatizado viável, registrar claramente:

- por que ele não é possível ou proporcional;
- qual prova alternativa é obrigatória;
- se depende de validação física no celular.

## Regra sobre tentativas que falharam

Registrar somente tentativas materiais que ensinem algo.

Não criar diário de comandos. Explicar:

- qual hipótese foi testada;
- por que parecia plausível;
- qual evidência mostrou que ela não resolvia a causa;
- que erro de raciocínio deve ser evitado no futuro.

## Fluxo sem bloqueios desnecessários

- O registro faz parte do bloco autorizado e não exige aceite separado.
- Correções pequenas necessárias para completar a prova continuam cobertas pelo bloco original, conforme `AGENTS.md`.
- A documentação não deve atrasar mitigação urgente.
- A falta de uma causa confirmada impede criar regra definitiva, mas não impede registrar no `PROJECT_STATE.md` que a investigação continua.
- Se surgir uma decisão de produto, alteração de escopo, risco novo ou mudança fora do contrato, continua sendo necessária nova decisão do proprietário.

## Critério de encerramento

Ao terminar um bloco relevante, o agente deve declarar uma das opções:

- `Nenhum aprendizado permanente novo`: explicar brevemente por quê; ou
- `Aprendizado fechado`: citar registro, regra especializada e teste/prova; ou
- `Aprendizado pendente`: causa ainda não confirmada, com impacto e próximo passo registrado no `PROJECT_STATE.md`.

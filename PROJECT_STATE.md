# Estado oficial — VETTA (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-06, horário de Brasília  
**Estado funcional:** Blocos 1A a 5 validados fisicamente; Bloco 6 aprovado tecnicamente e aguardando validação física.  
**Estado de governança:** skill `vetta-product-ux` instalada e registrada.  
**Alteração funcional em curso:** nenhuma nova edição; fechamento e validação do Bloco 6.

## Identificação da branch

| Item | Estado atual |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch em uso pelo GitHub Pages | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de UX |
| Site de validação | `https://vitoohugo333.github.io/VETTA/` |
| Fotografia funcional do Bloco 6 aprovada pela CI e pelo Pages | `374f0b9f53918d3519185ca72c451a9a8384f7f7` |
| Execução funcional e publicada aprovada | `31070928713` |
| Fotografia mais nova antes deste checkpoint | `c6abe4fabd54c76f77b471fd8af51d264c0143c1` |
| Branch estável | `netlify/teste-fechado` |
| Produção estável | `https://calculaae.netlify.app/` |

Uma fotografia salva é identificada por um commit. A fotografia `374f0b9...` contém o Bloco 6 funcional testado. As fotografias posteriores deste chat alteraram apenas governança e documentação; não substituem a necessidade de reconfirmar a CI após essas mudanças.

## Estado funcional preservado

Continuam validados fisicamente:

- Bloco 1A — Planejar;
- Bloco 1B — Histórico com Dias e Análise;
- Bloco 1C — Consolidar Hoje;
- Bloco 1D — Navegação final;
- Bloco 2 — Registro diário;
- Bloco 3 — Refinamento de Planejar;
- Bloco 4 — Refinamento de Histórico;
- Bloco 5 — Organização de Mais.

A navegação permanece:

```text
Hoje | Histórico | Planejar | Mais
```

## Bloco 6 — onboarding e linguagem

O Bloco 6 reutiliza o onboarding original de três etapas e a mesma persistência existente. Não cria um segundo fluxo nem uma nova fonte de dados.

### Resultado observável

- etapa 1 explica que a meta é o valor líquido que deve permanecer após os custos;
- dias por semana são descritos como rotina planejada;
- etapa 2 explica como preço e rendimento do combustível afetam o custo por quilômetro;
- etapa 3 apresenta uma revisão do planejamento antes de concluir;
- receita por quilômetro e contas mensais usam linguagem direta;
- a reserva inicial de manutenção de R$ 0,18 por km fica explicada;
- o usuário é informado de que poderá editar os valores depois em Planejar;
- se algum elemento obrigatório estiver ausente, o onboarding anterior permanece como retorno seguro.

### Arquivos funcionais

- `onboarding-6.js`: adapta linguagem e explicações sobre o fluxo existente;
- `today-1c.js`: carrega `onboarding-6.js` pela cadeia modular;
- `ci/branch-policy.json`: inclui `onboarding-6.js` na prova do GitHub Pages;
- `tests/onboarding-block-6-contract.test.mjs`: protege origem única, armazenamento, fallback, textos e elementos obrigatórios;
- `docs/planos/06-ONBOARDING-E-LINGUAGEM.md`: contrato específico do bloco.

### O que permaneceu intocado

- chave `vetta-driver-intelligence-v3`;
- regra `onboardingComplete` que impede reabrir o fluxo para usuários existentes;
- fórmulas financeiras;
- formato de dados;
- valores padrão e forma de salvar;
- registros, custos, eventos e fechamentos existentes;
- manifesto, service worker, cache e barreira de instalação;
- branch estável, Netlify e `main`.

## Evidência técnica

A execução `31070928713` testou exatamente a fotografia funcional `374f0b9f53918d3519185ca72c451a9a8384f7f7` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes determinísticos;
- contrato específico do Bloco 6;
- Chromium;
- Firefox;
- WebKit;
- paridade dos arquivos publicados;
- interação no GitHub Pages.

Uma nova execução publicada foi solicitada após as atualizações documentais e de governança deste chat. Seu resultado ainda não havia retornado no momento deste checkpoint.

## Skill de UX

A branch contém:

- `.skills/vetta-product-ux/SKILL.md`;
- `SKILLS.md` registrando uso obrigatório em diagnóstico, proposta, revisão e mudança de experiência.

A skill exige tarefa real, fluxo completo, estados, segurança dos dados, clareza dos números, teste automatizado e validação física.

## Branches criadas por engano

Não usar para desenvolvimento:

- `governance/vetta-product-ux`;
- `noop`;
- branches `tmp/` antigas.

Elas não alimentam GitHub Pages nem Netlify. A limpeza permanece pendente porque o conector disponível não expõe exclusão de branch.

## Aprendizado

**Aprendizado fechado:** antes de implementar um bloco, verificar se ele já existe na fotografia atual. Documentação atrasada não significa ausência de código. A apuração deve cruzar plano, módulos carregados, testes, CI e ambiente publicado antes de criar solução paralela.

## Próximo passo único

Validar fisicamente no celular o onboarding do Bloco 6: textos das três etapas, seleção de dias, combustível, resumo final, conclusão e confirmação de que um usuário já configurado não recebe o onboarding novamente.
# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03  
**Estado:** branch UX separada; Bloco 1 implementado; versão estável dos testadores preservada.  
**Alteração em curso:** Bloco 1 aguardando validação física no celular pelo GitHub Pages.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch estável dos testadores | `netlify/teste-fechado` |
| Site estável dos testadores | `https://calculaae.netlify.app` |
| Branch de desenvolvimento UX | `netlify/teste-fechado-ux` |
| Origem da branch UX | fotografia `c1cca4cd573004b332fb04a2c57c992b2ce8364a` da branch estável |
| Ambiente UX | GitHub Pages selecionado manualmente pelo proprietário; conteúdo servido ainda precisa de validação física |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |
| Branch histórica permanente | `migration/vetta-clean-3-5-1` |
| `main` | protegida e não alterada; `2a42c39612ec161bf58f16bbbbbd26521f28d30a` |

## Bloco 1 — navegação e tela Hoje

### Resultado implementado

- navegação principal apresentada como `Hoje | Histórico | Planejar | Mais`;
- a aba `Dia` saiu da navegação principal;
- `Registrar meu dia` continua acessível dentro de Hoje;
- a tela Hoje foi reduzida a:
  1. meta ou situação de hoje;
  2. progresso do mês;
  3. leitura ou recomendação contextual;
- detalhamento semanal, gráfico de distribuição, controle direto da meta e atalho secundário de planejamento deixaram de competir na tela Hoje;
- Ajustes foi apresentado como Planejar sem trocar os IDs e funções internas existentes.

### Proteções mantidas

- `app.js` não foi alterado;
- chave de armazenamento `vetta-driver-intelligence-v3` preservada;
- cálculos, registros, custos, eventos e importação/exportação preservados;
- manifesto, service worker, cache, instalação e barreira de acesso não alterados;
- `netlify/teste-fechado`, Netlify, `main` e PR #1 não receberam o Bloco 1.

## Arquivos do bloco

- `styles.css`: reorganização visual e nomes das quatro áreas;
- `tests/navigation-ux-contract.test.mjs`: contrato estático da navegação e preservação da chave de dados;
- `SKILLS.md`: regra de continuidade sem autorização duplicada;
- `docs/incidents/INC-0004-autorizacao-duplicada-em-deploy-previsivel.md`: aprendizado de processo;
- `PROJECT_STATE.md`: estado e pendência de validação.

## Evidência e limitações

- a branch UX nasceu idêntica à fotografia estável e recebeu as mudanças somente nela;
- a mudança funcional foi limitada à camada CSS existente;
- o teste criado verifica o contrato por leitura dos arquivos, mas não foi executado nesta sessão porque o ambiente isolado não conseguiu resolver o domínio do GitHub para baixar a cópia;
- não há CI automática confirmada para esta branch;
- a interface ainda precisa ser aberta e validada fisicamente no celular.

## Aprendizado do bloco

**Aprendizado fechado:** não pedir autorização duplicada quando um bloco já autorizado depende apenas de apontar uma branch conhecida no GitHub Pages para validação.

- regra: `SKILLS.md`;
- histórico: `docs/incidents/INC-0004-autorizacao-duplicada-em-deploy-previsivel.md`;
- prova operacional: Bloco 1 executado somente na branch UX, mantendo o Netlify estável.

## Próximo passo único

O proprietário deve abrir o GitHub Pages no celular e validar:

1. navegação `Hoje | Histórico | Planejar | Mais`;
2. ausência da aba Dia;
3. botão `Registrar meu dia` funcionando;
4. troca entre as quatro áreas;
5. conteúdo do formulário preservado ao navegar;
6. Histórico, Planejar e Mais acessíveis;
7. aparência geral sem cortes ou sobreposição.

Até essa confirmação, o Bloco 1 permanece **aguardando validação física**.

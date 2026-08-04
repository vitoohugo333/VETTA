# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-04, horário de Brasília  
**Estado:** Blocos 1A a 4 validados fisicamente; Bloco 5 aprovado tecnicamente e **aguardando validação física**.  
**Alteração em curso:** validação manual da área Mais organizada por assuntos.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional do Bloco 5 | `848493889483720aa988f19b185eed02116feb3a` |
| Execução automática funcional | `30947977950` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

Uma fotografia salva do projeto é identificada por um commit. O código acima identifica exatamente o conteúdo funcional que foi testado; não representa número de versão crescente.

## Blocos validados fisicamente

- Bloco 1A — Planejar;
- Bloco 1B — Histórico com Dias e Análise;
- Bloco 1C — Consolidar Hoje;
- Bloco 1D — Navegação final;
- Bloco 2 — Registro diário;
- Bloco 3 — Refinamento de Planejar;
- Bloco 4 — Refinamento de Histórico.

O proprietário informou em 2026-08-04 que o Bloco 4 foi validado no celular. Essa confirmação encerra a pendência física do Histórico e autorizou o início do Bloco 5; não autoriza o Bloco 6, `main`, merge ou produção.

A barra permanece:

```text
Hoje | Histórico | Planejar | Mais
```

## Bloco 5 — Organização de Mais

Mais deixou de abrir como uma rolagem única com recursos diferentes misturados. Agora abre como um resumo curto com cinco ilhas visíveis:

- Ferramentas;
- Relatórios;
- Meus dados;
- Radar;
- Aplicativo.

### Comportamento entregue

- cada ilha abre uma tela própria;
- Ferramentas mantém a comparação Gasolina × GNV, os mesmos campos, gráfico, economia projetada e botões de aplicação;
- Relatórios mantém o relatório mensal e o mesmo fluxo de impressão ou salvamento;
- Meus dados mantém exportação e importação do mesmo armazenamento local;
- Radar mantém lista, criação, edição e exclusão de eventos;
- Aplicativo mantém o cartão de instalação, o modal e a etiqueta original da versão;
- os elementos anteriores foram movidos como os mesmos elementos, sem segunda fonte de dados ou segunda versão do recurso;
- `Voltar para Mais` retorna ao resumo curto;
- o botão Voltar do Android ou navegador também retorna ao resumo;
- tocar novamente em Mais enquanto uma área está aberta retorna ao resumo;
- os resumos das ilhas acompanham combustível mais barato, quantidade de registros, custos, eventos e versão;
- se qualquer recurso obrigatório faltar, o Bloco 5 não ativa e a rolagem anterior de Mais permanece disponível como fallback.

## Arquivos funcionais e de proteção

- `more-5.js`: cria o resumo e as cinco telas usando os recursos existentes;
- `today-1c.js`: carrega `more-5.js` pela cadeia de módulos já validada;
- `ci/branch-policy.json`: inclui `more-5.js` na prova do GitHub Pages;
- `tests/more-block-5-contract.test.mjs`: protege inventário, origem única, fallback, armazenamento e navegação;
- `tests/e2e/more-block-5.spec.js`: testa comparação, relatório, exportação, importação, Radar, instalação, versão e retornos;
- `tests/e2e-remote/more-block-5-published.spec.js`: prova os cinco destinos no GitHub Pages;
- `tests/e2e/planning-block-1a.spec.js`: passou a aguardar a estabilização final da abertura PWA antes de tocar em Planejar no Firefox.

## Evidência automática

A execução `30947977950` verificou exatamente a fotografia funcional `848493889483720aa988f19b185eed02116feb3a` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes determinísticos;
- Chromium;
- Firefox;
- WebKit;
- cinco ilhas e respectivas telas;
- comparação Gasolina × GNV e gráfico;
- relatório mensal;
- exportação e importação usando o mesmo estado;
- criação, edição e exclusão no Radar;
- instalação e versão única do aplicativo;
- retorno por botão, Android e histórico do navegador;
- preservação dos blocos anteriores;
- paridade dos arquivos públicos com a branch;
- interação no próprio GitHub Pages.

## Falhas intermediárias classificadas

As execuções intermediárias encontraram proteções incompletas nos testes e uma duplicação visual real:

1. o fallback não exigia separadamente o campo de importação;
2. o fallback não exigia separadamente a lista do Radar;
3. o Bloco 5 criou uma segunda etiqueta de versão, embora o aplicativo já criasse a original em execução;
4. o contrato estático procurou incorretamente a etiqueta no HTML, mas sua origem real é `app.js`;
5. dois testes antigos de Planejar tocaram durante a última recarga normal do PWA no Firefox.

As correções tornaram importação, lista do Radar e versão original requisitos obrigatórios, removeram a cópia da versão e estabilizaram somente o teste antigo. Fórmulas, dados e comportamento financeiro não foram alterados.

## Aprendizado do bloco

**Nenhum aprendizado permanente novo.**

A exigência de origem única, identificadores únicos, fallback completo e espera pela estabilização do PWA já está coberta pelas regras e incidentes existentes. O Bloco 5 adicionou testes específicos que impedem a repetição dentro desta área.

## Proteções confirmadas

Não foram alterados pelo Bloco 5:

- fórmulas financeiras e significado dos cálculos;
- `styles.css`;
- chave `vetta-driver-intelligence-v3`;
- formato de registros, custos, eventos e fechamentos;
- funcionamento local-first;
- manifesto, service worker, cache, instalação e barreira de acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main`;
- PR #1.

`app.js` não recebeu alteração funcional do Bloco 5. Ele foi apenas confirmado como origem da etiqueta existente de versão e dos comportamentos reutilizados.

## Validação física pendente

O Bloco 5 permanece **aguardando validação física**.

No celular, validar:

1. abrir Mais pela barra inferior e confirmar uma tela curta com cinco ilhas;
2. abrir Ferramentas e conferir campos, gráfico e comparação Gasolina × GNV;
3. abrir Relatórios e conferir o fluxo de imprimir ou salvar;
4. abrir Meus dados e conferir Exportar e Importar sem perder dados;
5. abrir Radar, criar, editar e excluir um evento descartável;
6. abrir Aplicativo e conferir instalação e uma única versão visível;
7. dentro de cada área, usar `Voltar para Mais` e o botão Voltar do Android;
8. verificar cortes, sobreposições, travamentos e preservação dos registros.

## Próximo passo único

O proprietário deve validar o Bloco 5 no celular pelo GitHub Pages. O Bloco 6 — onboarding e linguagem — não está autorizado.

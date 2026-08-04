# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-03 22:14, horário de Brasília  
**Estado:** Bloco 1A — Planejar implementado, aprovado pela CI e validado fisicamente no celular.  
**Alteração em curso:** nenhuma mudança funcional; bloco encerrado e preservado na branch UX.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional testada | `7710f7db7be4485aab31bcbf96d51443d9f932a4` |
| Fotografia documental anterior | `e89edb67be6b0714f975300f8dc7e753ff7355fa` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Bloco 1A — Planejar

Foi construída uma área Planejar completa, acessada a partir de Início.

A área reúne:

- resumo do plano;
- objetivo mensal;
- agenda, dias específicos e folgas extras;
- operação e combustível;
- custos e reservas;
- gráfico de pizza `Distribuição da meta` e todos os valores associados;
- aprendizado local;
- restauração protegida dos parâmetros.

Todos os controles usam o mesmo estado, as mesmas funções e a mesma chave de dados já usados pelo aplicativo. Não foi criada uma segunda fonte de dados.

## Transição sem retirada

Durante o Bloco 1A:

- Início continua completo;
- Ajustes continua completo;
- o gráfico de pizza continua em Início e também aparece em Planejar;
- a navegação permanece `Início | Dia | Histórico | Ajustes | Mais`;
- nenhum elemento foi ocultado, removido ou recolhido no local original;
- a duplicação é temporária e só poderá ser retirada em bloco posterior após validação explícita do destino.

## Validação física concluída

Em 2026-08-03, o proprietário validou a interface no celular pelo GitHub Pages e informou que Planejar está no fim da página Início e que o resultado está bom.

A captura fornecida confirma, no trecho visível:

- carregamento do aplicativo em navegador móvel;
- tela Ajustes preservada;
- navegação inferior completa;
- ausência de corte, sobreposição ou quebra visual evidente no trecho exibido.

A posição atual de Planejar no fim de Início foi aceita para este bloco.

A validação física registra aparência e organização aprovadas pelo proprietário. Os fluxos funcionais permanecem sustentados pela cobertura automática descrita abaixo.

## Arquivos funcionais

- `planning-1a.js`: estrutura, renderização e interações da nova área Planejar;
- `app-shell.html`: carrega `planning-1a.js` depois do aplicativo principal;
- `ci/branch-policy.json`: inclui o novo módulo na prova de paridade do GitHub Pages.

## Testes adicionados e ajustados

- `tests/planning-block-1a-contract.test.mjs`:
  - preserva a chave `vetta-driver-intelligence-v3`;
  - exige o gráfico e os controles do Planejar;
  - exige que os elementos originais continuem presentes;
  - impede IDs de elementos duplicados;
  - impede ocultação ou remoção de Início e Ajustes pelo módulo.

- `tests/e2e/planning-block-1a.spec.js`:
  - abre Planejar e confere todos os destinos principais;
  - confirma o gráfico de pizza visível;
  - altera meta, agenda e combustível usando o mesmo estado;
  - cria exatamente um custo e confirma o mesmo item em Planejar e Ajustes;
  - volta para Início e confirma que os elementos originais continuam visíveis.

- `tests/e2e/cost-modal.spec.js`:
  - espera Ajustes ficar visível antes de abrir o modal de custos;
  - nenhuma lógica do aplicativo foi alterada por esse ajuste.

## Evidência automática

Execução final do estado anterior: `30867449870`.

A execução verificou a fotografia documental `e89edb67be6b0714f975300f8dc7e753ff7355fa` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes Node;
- Chromium;
- Firefox;
- WebKit;
- comparação dos arquivos públicos com o GitHub Pages, incluindo `planning-1a.js`;
- testes de interação no próprio site publicado.

## Proteções confirmadas

Não foram alterados pelo Bloco 1A:

- `app.js` e as fórmulas financeiras;
- chave ou formato dos dados locais;
- registros, eventos, importação e exportação;
- `styles.css`;
- manifesto, service worker, cache, instalação e acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main` como aplicativo;
- PR #1.

## Aprendizado

**Nenhum aprendizado permanente novo.**

O bloco aplicou regras já registradas: destino explícito antes de retirada, uma fonte única de dados, espera por estado observável nos testes e validação publicada independente da validação física.

## Próximo passo único

Preparar e apresentar o contrato do Bloco 1B — Histórico com Dias e Análise. Nenhuma retirada de conteúdo de Início ou Ajustes está autorizada por este estado.

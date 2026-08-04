# Estado oficial — CalculaAê (`netlify/teste-fechado-ux`)

**Atualizado em:** 2026-08-04, horário de Brasília  
**Estado:** Bloco 2 — Registro diário implementado, aprovado pela CI e pelo GitHub Pages; aguardando validação física no celular.  
**Alteração em curso:** validação manual do novo fluxo de registro.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch | `netlify/teste-fechado-ux` |
| Papel | desenvolvimento e validação de interface |
| Fotografia funcional testada | `25441d5c44bbf0673ba7f7082cfc29203b29b923` |
| Execução automática funcional | `30918538960` |
| GitHub Pages | `https://vitoohugo333.github.io/VETTA/` |
| Branch estável | `netlify/teste-fechado` |
| Netlify estável | `https://calculaae.netlify.app/` |
| Plano ativo | `docs/planos/01-CONSOLIDACAO-DA-EXPERIENCIA.md` |

## Blocos concluídos fisicamente

### Bloco 1A — Planejar

Concluído, aprovado pela CI e validado fisicamente no celular.

### Bloco 1B — Histórico com Dias e Análise

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

### Bloco 1C — Consolidar Hoje

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente em 2026-08-04.

### Bloco 1D — Navegação final

Concluído, aprovado pela CI, pelo GitHub Pages e validado fisicamente pelo proprietário em 2026-08-04.

A barra permanece:

```text
Hoje | Histórico | Planejar | Mais
```

## Bloco 2 — Registro diário

O fluxo aberto por `Hoje → Registrar meu dia` foi reorganizado sem substituir o formulário nem a gravação original.

### Comportamento entregue

- data permanece visível;
- faturamento e quilômetros aparecem como informações essenciais;
- horas online e combustível gasto permanecem no formulário, dentro de `Detalhes opcionais`;
- os opcionais começam recolhidos em um registro novo;
- ao editar um dia que possui horas ou combustível, os opcionais abrem preenchidos;
- a prévia continua usando os cálculos existentes e destaca o líquido;
- salvar chama a gravação canônica de `app.js`;
- uma data nova cria um registro;
- salvar novamente a mesma data atualiza o registro existente;
- a confirmação diferencia `Dia registrado` de `Dia atualizado`;
- a confirmação mostra faturamento, quilômetros e líquido;
- `Editar este dia` reabre o mesmo registro;
- `Concluir` retorna para Hoje;
- editar pelo Histórico continua abrindo o mesmo formulário;
- se faltar qualquer elemento obrigatório, o módulo não reorganiza a tela e preserva o formulário anterior.

## Arquivos funcionais e de proteção

- `record-2.js`: reorganiza o formulário e acrescenta a confirmação, delegando a gravação ao aplicativo original;
- `today-1c.js`: carrega o módulo do Bloco 2 depois da navegação consolidada;
- `ci/branch-policy.json`: inclui `record-2.js` na prova do site publicado;
- `tests/record-block-2-contract.test.mjs`: protege campos, armazenamento, uma data por registro, retorno seguro e seletores estáveis;
- `tests/e2e/record-block-2.spec.js`: testa registro novo, opcionais, confirmação, atualização sem duplicação e edição pelo Histórico;
- `tests/e2e-remote/record-block-2-published.spec.js`: prova o fluxo no GitHub Pages.

## Evidência automática

Execução funcional final: `30918538960`.

A execução verificou exatamente a fotografia funcional `25441d5c44bbf0673ba7f7082cfc29203b29b923` e concluiu com sucesso:

- governança, sintaxe, JSON e todos os testes Node;
- Chromium;
- Firefox;
- WebKit;
- prioridade dos campos essenciais;
- abertura e preenchimento dos opcionais;
- prévia financeira;
- confirmação depois de salvar;
- criação e atualização da mesma data sem duplicação;
- edição pelo Histórico;
- paridade dos arquivos públicos com o GitHub Pages;
- interação no próprio site publicado.

## Defeitos encontrados e aprendizado fechado

### Classe visual usada como seletor

A primeira implementação usou uma classe Tailwind com colchetes diretamente em `querySelector`. Os navegadores rejeitaram o seletor. A correção passou a usar a estrutura real da tela e a confirmar o título verdadeiro `Como foi seu dia?` antes de reorganizar qualquer elemento.

### Estado de teste apagado pela própria recarga

O teste de edição pelo Histórico preparava um registro e recarregava a página. O script inicial do teste restaurava o estado vazio. O cenário passou a iniciar diretamente com o registro esperado e a aguardar o botão de edição.

Registro completo: `docs/incidents/INC-0007-classe-tailwind-usada-como-seletor-css.md`.

Prevenção executável: `tests/record-block-2-contract.test.mjs` e `tests/e2e/record-block-2.spec.js`.

## Proteções confirmadas

Não foram alterados pelo Bloco 2:

- `app.js` e fórmulas financeiras;
- `styles.css`;
- chave `vetta-driver-intelligence-v3`;
- formato dos registros e demais dados locais;
- custos, eventos, fechamentos, importação e exportação;
- manifesto, service worker, cache, instalação e acesso;
- branch `netlify/teste-fechado` e Netlify dos testadores;
- `main`;
- PR #1.

## Validação física pendente

O Bloco 2 permanece **aguardando validação física**.

No celular, validar:

1. abrir `Hoje → Registrar meu dia`;
2. confirmar que data, faturamento e quilômetros estão visíveis;
3. confirmar que `Detalhes opcionais` começa recolhido;
4. abrir os detalhes e preencher horas e combustível gasto;
5. confirmar que o líquido da prévia muda ao preencher os números;
6. salvar e conferir a tela `Dia registrado`;
7. tocar em `Editar este dia`, mudar o faturamento e salvar novamente;
8. conferir `Dia atualizado` e apenas uma ocorrência daquela data no Histórico;
9. tocar em `Concluir` e voltar para Hoje;
10. verificar cortes, sobreposições, travamentos e preservação dos dados.

## Próximo passo único

O proprietário deve validar o Bloco 2 no celular pelo GitHub Pages. O Bloco 3 — refinamento de Planejar — não está autorizado.

# VETTA — conhecimentos técnicos obrigatórios

Este arquivo é o índice permanente das verificações técnicas do projeto. Deve ser lido junto com `AGENTS.md` antes de `PROJECT_STATE.md`.

- `AGENTS.md`: autoridade, escopo e forma de trabalhar.
- `SKILLS.md`: conhecimentos transversais e indicação dos arquivos especializados.
- `LEARNING_RULES.md`: ciclo obrigatório para preservar incidentes e aprendizados reutilizáveis.
- arquivos especializados, como `PWA_RULES.md`: regras técnicas de uma área.
- `tests/README.md`: estratégia de testes, custo-benefício e limites da automação de navegador.
- `docs/incidents/`: história completa de falhas e descobertas relevantes já confirmadas.
- `PROJECT_STATE.md`: estado atual, evidências e pendências da branch.

Um aprendizado só entra aqui ou no arquivo especializado quando houver causa confirmada e regra reutilizável. Hipótese não vira regra.

## Leitura obrigatória por tipo de trabalho

- Em todo trabalho técnico: ler `AGENTS.md`, este `SKILLS.md` e `PROJECT_STATE.md`.
- Antes de encerrar um bloco que encontrou defeito, quase falha ou conhecimento reutilizável: ler e aplicar `LEARNING_RULES.md`.
- Ao investigar sintoma semelhante a algo já ocorrido: consultar o índice `docs/incidents/README.md` antes de formular a correção.
- Antes de criar, ampliar ou executar automação de navegador, CI ou teste de interação: ler `tests/README.md` e preservar sua política de custo-benefício.
- Alteração em instalação, manifesto, service worker, cache, ícones, modo standalone, barreira de acesso ou publicação do PWA: ler `PWA_RULES.md`.
- Quando surgir uma nova área com regras recorrentes, criar um arquivo operacional específico e registrá-lo aqui e no `AGENTS.md`.

## Fechamento obrigatório de aprendizado

Ao terminar um bloco técnico relevante, o agente deve registrar uma destas conclusões:

- `Nenhum aprendizado permanente novo`, com justificativa breve;
- `Aprendizado fechado`, citando incidente/aprendizado, regra e teste ou prova;
- `Aprendizado pendente`, quando a causa ainda não estiver confirmada, mantendo a investigação no `PROJECT_STATE.md`.

Esse fechamento faz parte do bloco já autorizado. Não exige nova autorização e não deve interromper mitigação urgente.

## Quando preservar conhecimento

Além de falhas graves, registrar descobertas que tenham valor claro para:

- outras áreas do CalculaAê;
- outros PWAs;
- outras aplicações web;
- projetos futuros;
- práticas gerais de engenharia.

A relevância futura do conhecimento importa tanto quanto o tamanho imediato do erro. Os critérios completos estão em `LEARNING_RULES.md`.

## Onde cada aprendizado deve ser registrado

- `AGENTS.md`: autorização, escopo, comunicação, checkpoints e forma de operar.
- `SKILLS.md`: índice dos conhecimentos permanentes e regra para localizar o arquivo especializado correto.
- `LEARNING_RULES.md`: critérios, ciclo de aprendizado e equilíbrio entre rigor e praticidade.
- `docs/incidents/`: sintoma, causa imediata, causa estrutural, falha de detecção, tentativas materiais, prevenção, alcance e evidências.
- arquivo especializado, como `PWA_RULES.md`: causa técnica confirmada, prevenção e teste obrigatório daquela área.
- `tests/README.md`: estratégia prática de testes, consumo de recursos e diferença entre prova automatizada e validação física.
- teste automatizado: prova executável que impede a regressão.
- `PROJECT_STATE.md`: o que aconteceu nesta branch, qual fotografia foi publicada, validação manual e pendência atual.

O mesmo problema pode gerar registros complementares, mas não cópias desorganizadas: a história fica em `docs/incidents/`; a regra operacional fica no arquivo da área; a evidência atual fica no `PROJECT_STATE.md`; a prevenção executável fica no teste.

## Arquivos especializados atuais

| Área | Arquivo obrigatório | Histórico e provas |
|---|---|---|
| Aprendizado técnico | `LEARNING_RULES.md` | `docs/incidents/README.md` |
| PWA, instalação e abertura standalone | `PWA_RULES.md` | incidentes `INC-0001` e `INC-0002`; testes de PWA |
| Automação de navegador e CI | `tests/README.md` | `playwright.config.js`, `tests/e2e-remote/` e workflows aplicáveis |

Não criar arquivos especializados vazios. Uma nova área nasce quando existir ao menos uma regra confirmada e reutilizável que justifique sua manutenção.

## Sincronização remota e deploy ligado à branch

A branch remota confirmada é a fonte de trabalho em tempo real. Uma cópia local pode preparar e testar, mas o bloco só termina depois de sincronizar a alteração autorizada no GitHub e verificar o resultado remoto.

Quando uma branch alimenta automaticamente um site de validação:

1. confirmar a ponta da branch imediatamente antes de gravar;
2. criar o commit somente sobre essa ponta, sem sobrescrever avanço concorrente;
3. confirmar que o GitHub passou a apontar para o novo commit;
4. identificar o deploy gerado por esse commit;
5. verificar que o deploy ficou pronto e que o conteúdo técnico relevante corresponde ao commit;
6. manter mudanças de interface ou PWA como **aguardando validação física** até o teste no celular.

Commit é uma fotografia salva do projeto. Deploy pronto comprova que essa fotografia foi servida, mas não substitui os testes funcionais nem a validação física exigida.

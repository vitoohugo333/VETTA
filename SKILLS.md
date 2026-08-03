# VETTA — conhecimentos técnicos obrigatórios

Este arquivo é o índice permanente das verificações técnicas do projeto. Deve ser lido junto com `AGENTS.md` antes de `PROJECT_STATE.md`.

- `AGENTS.md`: autoridade, escopo e forma de trabalhar.
- `SKILLS.md`: conhecimentos transversais e indicação dos arquivos especializados.
- arquivos especializados, como `PWA_RULES.md`: regras técnicas de uma área.
- `PROJECT_STATE.md`: estado atual, evidências e pendências da branch.

Um aprendizado só entra aqui ou no arquivo especializado quando houver causa confirmada e regra reutilizável. Hipótese não vira regra.

## Arquivos especializados obrigatórios

- Alteração em instalação, manifesto, service worker, cache, ícones, modo standalone, barreira de acesso ou publicação do PWA: ler `PWA_RULES.md`.
- Quando surgir uma nova área com regras recorrentes, criar um arquivo operacional específico e registrá-lo aqui e no `AGENTS.md`.

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

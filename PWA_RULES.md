# Regras permanentes de PWA do CalculaAê

Este arquivo deve ser lido junto com o `AGENTS.md` antes de qualquer mudança em instalação, manifesto, service worker, cache, ícones, modo standalone ou publicação do PWA.

## Checklist obrigatório antes de alterar

1. Confirmar a branch e a fotografia atual no GitHub.
2. Ler `manifest.webmanifest`, `sw.js`, `index.html`, `netlify.toml` e consumidores relacionados.
3. Confirmar que o manifesto contém:
   - `name` e `short_name` corretos;
   - `start_url` e `scope` coerentes;
   - `display: standalone`;
   - ícones PNG explícitos de 192×192 e 512×512;
   - ícone adequado para `maskable`.
4. Confirmar que o service worker:
   - registra sem erro;
   - inclui os arquivos do app shell necessários;
   - usa um nome de cache novo quando arquivos críticos de instalação mudam;
   - remove caches antigos sem apagar dados do aplicativo.
5. Confirmar que `index.html`, manifesto e service worker não ficam presos em cache antigo.
6. Confirmar que o botão de instalação nunca fica em estado de espera infinito.
7. Tratar separadamente Android, iPhone/Safari e navegadores internos de redes sociais.
8. Não afirmar instalabilidade apenas porque o deploy passou. Exigir teste real no navegador e validação física no celular.

## Estados mínimos da tela Android

- preparando por tempo limitado;
- instalador disponível;
- instalando;
- instalação cancelada;
- tentativa novamente;
- falha de preparação com saída clara;
- instalado.

Nenhum estado de espera pode permanecer indefinidamente. Se `beforeinstallprompt` não chegar dentro do limite definido, a interface deve oferecer nova tentativa e explicar que o navegador ainda não liberou o instalador.

## Estados mínimos da tela iPhone

- passos de Compartilhar → Adicionar à Tela de Início;
- confirmação manual `Já adicionei`;
- estado concluído destacado;
- nenhuma promessa de abertura automática do instalador.

## Provas obrigatórias antes de encerrar

- manifesto carregado com MIME correto;
- ícones 192 e 512 presentes e referenciados;
- service worker publicado e controlando a página;
- deploy ligado à fotografia esperada;
- botão Android sem espera infinita;
- validação física registrada no `PROJECT_STATE.md`.

## Aprendizado operacional

Erros recorrentes de PWA devem virar regra neste arquivo, não apenas comentário de chat. Ao encontrar uma nova falha repetível, registrar aqui a causa, a prevenção e a prova necessária antes de encerrar o bloco.

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
9. Preservar byte a byte a interface aprovada quando o contrato autorizar apenas mudança de lógica. Não reescrever textos, CSS ou estrutura visual como efeito colateral.

## Fonte de verdade da instalação

- `localStorage` nunca pode ser usado como prova principal de que o PWA está instalado ou desinstalado.
- Apagar uma marca local não desinstala o aplicativo no Android.
- No Android, combinar:
  - `display-mode: standalone` quando aberto pelo ícone;
  - `navigator.getInstalledRelatedApps()` quando suportado;
  - `beforeinstallprompt` quando o Chrome disponibilizar o instalador;
  - `appinstalled` após a conclusão.
- Se o Chrome já considerar o PWA instalado, ele pode não disparar `beforeinstallprompt` nem mostrar a opção de instalação no menu.
- O manifesto deve declarar o próprio PWA em `related_applications`, com `prefer_related_applications: false`, sem mudar o `id` já usado pelos usuários.

## Estados mínimos da tela Android

- verificando se já está instalado;
- preparando por tempo limitado;
- instalador disponível;
- instalando;
- instalação cancelada;
- verificar novamente;
- falha de preparação com saída clara;
- instalado.

Nenhum estado de espera pode permanecer indefinidamente. Se `beforeinstallprompt` não chegar dentro do limite definido, a interface deve permitir nova verificação sem fingir que consegue forçar o instalador.

## Estados mínimos da tela iPhone

- passos de Compartilhar → Adicionar à Tela de Início;
- confirmação manual `Já adicionei`;
- estado concluído destacado;
- nenhuma promessa de abertura automática do instalador.

## Provas obrigatórias antes de encerrar

- manifesto carregado com MIME correto;
- ícones 192 e 512 presentes e referenciados;
- relação `webapp` consigo mesmo declarada quando houver detecção de instalação;
- service worker publicado e controlando a página;
- deploy ligado à fotografia esperada;
- interface comparada com a fotografia aprovada quando deveria permanecer intacta;
- botão Android sem espera infinita;
- validação física registrada no `PROJECT_STATE.md`.

## Aprendizado operacional

Erros recorrentes de PWA devem virar regra neste arquivo, não apenas comentário de chat. Ao encontrar uma nova falha repetível, registrar aqui a causa, a prevenção e a prova necessária antes de encerrar o bloco.

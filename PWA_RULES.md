# Regras permanentes de PWA do CalculaAê

Este arquivo deve ser lido junto com o `AGENTS.md` e o `SKILLS.md` antes de qualquer mudança em instalação, manifesto, service worker, cache, ícones, modo standalone, barreira de acesso ou publicação do PWA.

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
10. Se houver senha, Edge Function, middleware ou outra barreira, confirmar que os arquivos técnicos públicos do PWA não foram bloqueados.

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

## PWA protegido por acesso

Quando o site tiver senha, login, Edge Function, middleware, redirect ou outra barreira, estes arquivos técnicos devem continuar acessíveis sem autenticação:

- `/manifest.webmanifest`;
- `/sw.js` — o **service worker**, arquivo que controla instalação, cache e funcionamento offline;
- `/icon.svg`;
- `/icon-192.png`;
- `/icon-512.png`.

A interface, os dados e as páginas do aplicativo continuam protegidos. Somente esses arquivos técnicos ficam fora da barreira. Nenhuma nova proteção global em `/*` pode ser aceita sem revisar explicitamente essas exceções.

### Prova obrigatória da barreira

1. manifesto responde com HTTP `200` e `Content-Type: application/manifest+json`;
2. service worker responde com HTTP `200` e JavaScript válido;
3. ícones respondem como imagens;
4. páginas do aplicativo continuam protegidas;
5. `tests/pwa-access-boundary.test.mjs` passa.

## Abertura do aplicativo sem mostrar a instalação

A página `index.html` é exclusiva do navegador e do processo de instalação. O aplicativo já instalado não pode renderizar essa página nem por um quadro antes de abrir a interface interna.

- `manifest.webmanifest` deve usar `start_url: "./app-shell.html"` nesta arquitetura.
- Instalações antigas que ainda abram `./` devem ser detectadas no `<head>`, antes do `<body>` e antes do primeiro desenho da tela.
- Nesse caminho de compatibilidade, ocultar o documento imediatamente e usar `location.replace('./app-shell.html')`.
- Não buscar `app-shell.html` de forma assíncrona para depois substituir o documento, porque isso permite que a tela de instalação apareça por um instante.
- Mudança em `index.html` ou `manifest.webmanifest` exige renovação do cache do service worker.
- `tests/pwa-standalone-launch.test.mjs` deve passar.

### Prova física obrigatória

1. fechar completamente o PWA;
2. abrir pelo ícone em uma partida fria;
3. confirmar que nenhuma parte da tela de instalação aparece;
4. repetir a abertura depois de fechar o aplicativo novamente.

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

## Automação de navegador sem burlar a instalação

Testes automatizados podem precisar acessar a interface interna sem instalar fisicamente o PWA. Esse acesso só é aceitável quando todas as condições abaixo forem preservadas:

- o caminho especial depende de uma característica inequívoca do navegador automatizado, como `navigator.webdriver`;
- um parâmetro explícito, atualmente `forceBrowser=1`, deve permitir testar a experiência normal de navegador sem o desvio de automação;
- a mesma execução deve comprovar que a página comum continua protegida por senha e mostra a instalação, sem renderizar a interface interna;
- somente depois dessa prova o robô pode abrir o aplicativo pelo caminho exclusivo de automação;
- nenhuma chave em `localStorage`, query pública isolada ou botão escondido pode liberar o aplicativo para um usuário comum;
- a senha usada pelo robô deve entrar por segredo de ambiente e nunca ser gravada no repositório;
- automação de Chromium não prova instalação real, ícone no sistema, abertura pelo sistema operacional nem comportamento físico do Android ou iPhone.

O teste remoto econômico está documentado em `tests/README.md` e implementado em `tests/e2e-remote/usage-gate.spec.js`.

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

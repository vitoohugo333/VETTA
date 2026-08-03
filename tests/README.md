# Testes do CalculaAê

## Testes locais existentes

O comando `npm run test:e2e` usa Chromium contra a pasta `_site` e protege os fluxos já automatizados da interface.

O comando `npm run test:pwa` verifica os contratos de acesso, instalação e abertura standalone sem depender de um navegador real.

## Teste remoto econômico de uso

O arquivo `tests/e2e-remote/usage-gate.spec.js` executa um único cenário no site publicado:

1. confirma que manifesto, service worker e ícones continuam públicos;
2. confirma que a página comum continua protegida por senha;
3. autentica pela rota isolada `/__vetta-robot-access`, usando uma senha exclusiva guardada fora do repositório;
4. usa `forceBrowser=1` para provar que a tela de instalação continua obrigatória no navegador comum;
5. abre novamente sem `forceBrowser`, permitindo que somente o navegador automatizado siga para `app-shell.html`;
6. testa digitação, navegação, botão voltar e preservação do formulário;
7. falha se houver erro JavaScript não tratado.

A rota do robô não altera as três credenciais dos testadores. Ela usa um hash separado no Netlify e cria uma sessão normal, com o mesmo cookie e as mesmas limitações do acesso existente.

## Regras de custo-benefício

- execução somente manual;
- uma máquina Linux;
- somente Chromium;
- um trabalhador e nenhuma repetição automática;
- limite máximo de oito minutos;
- vídeo desligado;
- captura e trace somente quando houver falha;
- evidências mantidas por apenas um dia;
- nova execução cancela outra igual ainda em andamento.

Não ampliar para matriz de navegadores, emulador Android, vídeo permanente ou execução em todo commit sem uma necessidade comprovada e autorização específica.

## Variáveis necessárias

- `VETTA_TEST_BASE_URL`: endereço publicado a testar, normalmente `https://calculaae.netlify.app`.
- `VETTA_TEST_PASSWORD`: senha exclusiva do robô. Deve ser guardada como segredo do GitHub com esse nome e nunca escrita em arquivo, log ou comentário.
- `VETTA_ACCESS_ROBOT_HASH`: hash da senha exclusiva do robô, guardado como variável secreta de runtime no Netlify.

Execução fora do GitHub Actions:

```bash
VETTA_TEST_BASE_URL=https://calculaae.netlify.app \
VETTA_TEST_PASSWORD='senha-fornecida-no-ambiente' \
npx playwright test
```

## Workflow manual

O workflow preparado está em `.github/workflows/test-usage-manual.yml`.

O GitHub só exibe e aceita o acionamento manual quando o arquivo também existe na branch padrão do repositório. A `main` funciona apenas como painel de acionamento; ao escolher `netlify/teste-fechado`, o GitHub baixa e executa os testes daquela branch.

Isso não exige levar o aplicativo, cálculos ou dados para a `main`.

## Desativação

O acesso do robô pode ser desativado de forma simples por qualquer uma destas ações:

- desativar ou remover o workflow manual;
- apagar o segredo `VETTA_TEST_PASSWORD` do GitHub;
- apagar a variável `VETTA_ACCESS_ROBOT_HASH` do Netlify;
- remover a rota `/__vetta-robot-access` e o arquivo `robot-access.js`.

Nenhuma dessas ações altera os dados ou a interface do aplicativo.

## Limite da prova automatizada

Este teste confirma a barreira, a autenticação e o uso da interface em Chromium automatizado. Ele não comprova instalação real pelo sistema operacional.

Mudanças em instalação, manifesto, service worker, cache, ícones ou abertura standalone continuam exigindo a validação física definida em `PWA_RULES.md`.

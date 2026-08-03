# Testes do CalculaAê

## Testes locais existentes

O comando `npm run test:e2e` usa Chromium contra a pasta `_site` e protege os fluxos já automatizados da interface.

O comando `npm run test:pwa` verifica os contratos de acesso, instalação e abertura standalone sem depender de um navegador real.

## Teste remoto econômico de uso

O arquivo `tests/e2e-remote/usage-gate.spec.js` executa um único cenário no site publicado:

1. confirma que manifesto, service worker e ícones continuam públicos;
2. confirma que a página comum continua protegida por senha;
3. autentica com uma credencial existente, sem gravar a senha no repositório;
4. usa `forceBrowser=1` para provar que a tela de instalação continua obrigatória no navegador comum;
5. abre novamente sem `forceBrowser`, permitindo que somente o navegador automatizado siga para `app-shell.html`;
6. testa digitação, navegação, botão voltar e preservação do formulário;
7. falha se houver erro JavaScript não tratado.

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
- `VETTA_TEST_PASSWORD`: uma senha já autorizada no Netlify. Ela deve ser guardada como segredo do GitHub com esse nome e nunca escrita em arquivo, log ou comentário.

Execução fora do GitHub Actions:

```bash
VETTA_TEST_BASE_URL=https://calculaae.netlify.app \
VETTA_TEST_PASSWORD='senha-fornecida-no-ambiente' \
npx playwright test
```

## Workflow manual

O workflow preparado está em `.github/workflows/test-usage-manual.yml`.

O GitHub só exibe e aceita o acionamento manual quando o arquivo também existe na branch padrão do repositório. Enquanto ele existir apenas em `netlify/teste-fechado`, a infraestrutura está preparada, mas o botão manual permanece **não ativado**.

Ativar esse botão exige autorização separada e expressa para adicionar o mesmo workflow à `main`. Isso não exige levar o aplicativo, cálculos ou dados da branch de validação para a `main`.

## Limite da prova automatizada

Este teste confirma a barreira, a autenticação e o uso da interface em Chromium automatizado. Ele não comprova instalação real pelo sistema operacional.

Mudanças em instalação, manifesto, service worker, cache, ícones ou abertura standalone continuam exigindo a validação física definida em `PWA_RULES.md`.

# VETTA — índice técnico da branch `main`

A `main` é o ponto de entrada e controle do repositório. Ela não substitui os conhecimentos técnicos da branch onde o aplicativo será realmente alterado.

## Regra obrigatória

Antes de qualquer diagnóstico ou mudança:

1. identificar a branch-alvo;
2. ler `AGENTS.md`, `SKILLS.md`, arquivos especializados e `PROJECT_STATE.md` da branch-alvo;
3. confirmar GitHub, PR, CI e ambiente servido proporcionais ao risco;
4. usar a `main` apenas para regras gerais e acionamento dos workflows que precisam existir na branch padrão.

## Branches atuais

| Branch | Papel |
|---|---|
| `main` | controle, governança e lançador manual de testes |
| `netlify/teste-fechado` | aplicativo estável dos testadores e Netlify |
| `netlify/teste-fechado-ux` | desenvolvimento da reorganização da interface |
| `migration/vetta-clean-3-5-1` | referência histórica permanente |

## Automação de navegador

O workflow `.github/workflows/test-usage-manual.yml` existe na `main` apenas para disponibilizar o botão manual do GitHub Actions.

Ao executar, selecionar a branch que contém o aplicativo e os testes, normalmente `netlify/teste-fechado`. O checkout e a execução devem usar essa branch escolhida.

Regras permanentes:

- execução manual;
- somente Chromium e Linux por padrão;
- limite curto;
- sem vídeo permanente;
- evidência somente em falha;
- senha apenas em segredo do GitHub;
- nenhuma execução automática sem necessidade comprovada e nova autorização.

## Segurança

A credencial exclusiva do robô é independente das senhas dos testadores. O GitHub guarda a senha em `VETTA_TEST_PASSWORD`; o Netlify guarda apenas o hash em `VETTA_ACCESS_ROBOT_HASH`.

A remoção de qualquer um desses dois valores desativa o acesso automatizado sem alterar interface, cálculos ou dados.

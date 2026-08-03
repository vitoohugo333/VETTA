# Estado oficial — CalculaAê

**Atualizado em:** 2026-08-03  
**Estado:** versão estável preservada; acesso exclusivo do robô implantado; workflow manual ativado na `main`.  
**Alteração em curso:** cadastro do segredo `VETTA_TEST_PASSWORD` no GitHub e primeira execução remota ainda pendentes.

## Estado atual

| Item | Estado |
|---|---|
| Repositório | `vitoohugo333/VETTA` |
| Branch estável dos testadores | `netlify/teste-fechado` |
| Site estável | `https://calculaae.netlify.app` |
| Branch UX | `netlify/teste-fechado-ux` |
| `main` | painel de controle, regras gerais e workflow manual |
| Referência histórica | `migration/vetta-clean-3-5-1` |
| Alteração técnica do robô | concluída até `dc8f560bb5c8530016c84d2d82d5f674660c6384` |
| Deploy confirmado | `6a71241038bc2f000863ea59`, pronto e ligado a `dc8f560bb5c8530016c84d2d82d5f674660c6384` |

## Resultado deste bloco

Foi criado um acesso separado para o navegador automatizado sem alterar as três credenciais dos testadores.

- o Netlify guarda somente o hash em `VETTA_ACCESS_ROBOT_HASH`;
- a rota `/__vetta-robot-access` aceita apenas `POST`;
- senha errada retorna acesso negado;
- senha correta cria uma sessão normal do site;
- a rota usa uma credencial ativa existente apenas como identidade da sessão;
- nenhuma senha em texto foi escrita no repositório;
- a barreira principal `calculaae-access-gate` permaneceu intacta.

## Teste remoto econômico

O workflow manual está em `.github/workflows/test-usage-manual.yml` na `main` e também existe na branch estável.

Ao executar escolhendo `netlify/teste-fechado`, o GitHub usa o aplicativo e os testes dessa branch. A `main` não precisa conter o aplicativo.

Proteções mantidas:

- execução somente manual;
- Linux e Chromium únicos;
- limite de oito minutos;
- sem repetição automática;
- vídeo desligado;
- captura e trace somente em falha;
- evidência mantida por um dia.

## Evidências

- teste local da nova rota passou com senha correta, senha errada e método não permitido;
- `node --check` passou para a nova Edge Function e seu teste;
- Netlify publicou duas Edge Functions sem erro;
- deploy `6a71241038bc2f000863ea59` ficou pronto;
- nenhum arquivo de interface, cálculo, dados, manifesto, service worker ou cache foi alterado.

## Ainda pendente

- o conector GitHub não oferece criação de segredo;
- o `gh` oficial não está instalado no ambiente;
- o proprietário precisa cadastrar uma única vez o segredo `VETTA_TEST_PASSWORD` usando a senha exclusiva gerada neste bloco;
- depois disso, executar o workflow selecionando `netlify/teste-fechado`;
- o navegador remoto ainda não foi executado contra o site real.

## Branch temporária criada por engano

Foi criada `tmp/robot-access-safe` antes da preparação local. Nenhum arquivo foi gravado nela e ela aponta para a fotografia estável anterior ao bloco.

O conector atual não oferece exclusão de branch. Ela deve ser removida pela interface do GitHub quando conveniente e não deve ser usada para desenvolvimento.

## Aplicativo e validação física

- a versão dos testadores continua no mesmo endereço;
- nenhuma tela, cálculo, dado ou comportamento de instalação foi alterado;
- não é necessária nova validação física no celular para esta infraestrutura;
- o fluxo completo no iPhone/Safari continua não confirmado.

## Aprendizado do bloco

**Nenhum aprendizado permanente novo.** Este bloco aplicou o aprendizado já registrado em `INC-0003`: automação e instalação física são provas separadas, e o acesso do robô deve permanecer isolado, revogável e fora do código público.

## Próximo passo único

Cadastrar o segredo `VETTA_TEST_PASSWORD` no GitHub e executar a primeira prova manual contra `https://calculaae.netlify.app`, selecionando a branch `netlify/teste-fechado`.

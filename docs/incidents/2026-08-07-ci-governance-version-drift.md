# Incidente — CI canônica bloqueada por versão fixa de governança

**Data:** 2026-08-07  
**Área:** governança / CI  
**Estado:** aprendizado fechado

## 1. Sintoma

A execução `full` da branch `refatoracao-360-ux` falhou antes de executar testes Node ou navegadores.

Mensagem principal:

`AssertionError: Versão de governança inválida em AGENTS.md`

Execução que revelou o problema: `31197944926`.

## 2. Causa imediata

`scripts/ci/verify-repository.mjs` exigia literalmente:

`VETTA_GOVERNANCE_VERSION: 2026-08-03.2`

em todos os arquivos canônicos.

## 3. Causa estrutural

O verificador tratava um número de versão histórico como regra permanente. A governança canônica evoluiu de forma legítima e arquivos diferentes passaram a possuir versões atuais diferentes, por exemplo:

- `AGENTS.md`: `2026-08-07.1`;
- `SKILLS.md`: `2026-08-07.2`.

A proteção realmente necessária não é todos os arquivos terem o mesmo número fixo. É:

1. cada arquivo canônico possuir um marcador de versão válido;
2. uma branch operacional manter o arquivo exatamente igual ao correspondente da `main`.

## 4. Falha de detecção

A atualização da governança mudou os marcadores, mas o verificador continha a versão antiga embutida no código. Não havia prevenção contra esse acoplamento temporal.

## 5. Correção

O verificador passou a:

- aceitar um marcador no formato `AAAA-MM-DD.N`;
- rejeitar arquivos sem marcador válido;
- continuar exigindo igualdade byte a byte com a versão canônica da `main` quando uma branch é verificada;
- não conhecer uma data específica de governança.

Nenhum arquivo funcional do aplicativo foi alterado por esta correção.

## 6. Prevenção permanente

Nunca fixar no motor de CI um número histórico específico de `VETTA_GOVERNANCE_VERSION` como requisito global.

O contrato permanente é **marcador válido + igualdade com a `main`**, permitindo que cada arquivo canônico evolua sua própria versão sem reduzir a proteção contra divergência entre branches.

## 7. Prova

Após a correção, a execução `full` da própria `main` concluiu com sucesso:

- execução: `31199195848`;
- classificação/identidade: passou;
- integridade, sintaxe, JSON e testes determinísticos: passaram;
- navegador: corretamente ignorado porque a `main` é governança e não publica o aplicativo.

## 8. Alcance do aprendizado

Aplica-se a qualquer arquivo canônico listado pelo verificador de repositório e a futuras evoluções da governança do VETTA.

**Aprendizado fechado.**

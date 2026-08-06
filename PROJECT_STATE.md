# Estado oficial — VETTA (`main`)

**Atualizado em:** 2026-08-06  
**Estado:** governança canônica operacional; skill `vetta-product-ux` distribuída nas branches existentes.  
**Alteração em curso:** padronizar a descoberta da skill nas branches antigas e limpar branches temporárias com autorização e ferramenta apropriada.

## Papel da `main`

A `main` mantém governança, regras canônicas e orquestração. Não publica o aplicativo.

## Ambientes e branches operacionais

| Finalidade | Branch | Ambiente |
|---|---|---|
| Governança canônica | `main` | não publica o app |
| Produção estável/testadores | `netlify/teste-fechado` | `https://calculaae.netlify.app/` |
| Desenvolvimento de UX | `netlify/teste-fechado-ux` | `https://vitoohugo333.github.io/VETTA/` |
| Referência histórica/PR #1 | `migration/vetta-clean-3-5-1` | sem desenvolvimento novo |

## Skill VETTA Product UX

O arquivo `.skills/vetta-product-ux/SKILL.md` foi adicionado a todas as branches existentes em 2026-08-06. Ele exige análise por tarefa real, fluxo completo, estados, segurança dos dados, clareza dos números, comportamento mobile e validação física quando aplicável.

O índice `SKILLS.md` foi atualizado na `main`, na branch de UX e na branch estável. Branches antigas e temporárias receberam o arquivo da skill, mas não passam a ser branches válidas de trabalho por causa disso.

## Branches existentes no momento do bloco

- `main`;
- `netlify/teste-fechado`;
- `netlify/teste-fechado-ux`;
- `migration/vetta-clean-3-5-1`;
- `feature/bloco-1-navegacao-secundaria`;
- `governance/vetta-product-ux`;
- `tmp/pwa-gate-apply`;
- `tmp/pwa-gate-apply-2`;
- `tmp/robot-access-safe`;
- `noop`.

`governance/vetta-product-ux` e `noop` foram criadas sem necessidade durante esta operação. O conector disponível não oferece exclusão de branch. Elas não alimentam Pages ou Netlify e não devem ser reutilizadas.

## Proteção incorporada

- trabalhar na branch atual quando ela comportar o objetivo com segurança;
- não criar branch apenas para documentação ou governança que pode ser aplicada na branch em uso;
- distinguir branch em uso, mais recentemente modificada, mais atual por finalidade e efetivamente publicada;
- manter `PROJECT_STATE.md` atualizado no mesmo bloco;
- não transformar branch temporária ou histórica em branch operacional por acidente.

## Impacto

Nenhum arquivo do aplicativo, cálculo, armazenamento, PWA, interface, GitHub Pages ou Netlify foi alterado por este bloco. Os commits foram exclusivamente documentais.

## Aprendizado

**Aprendizado fechado:** a criação automática de branch sem necessidade aumenta divergência e confusão. A regra agora é usar a branch atual adequada e só criar nova branch quando houver necessidade técnica comprovada.

## Próximo passo único

Limpar as branches temporárias e acidentais quando houver ferramenta de exclusão disponível ou autorização para usar outro meio seguro, preservando apenas as branches operacionais definidas.

# Solução para Imagem no NPM

## Problema
O NPM pode ter restrições ou cache que impedem a exibição de imagens do GitHub no README.

## Soluções Aplicadas

1. ✅ **Incluída pasta `assets/` no package.json** - A imagem agora está no pacote publicado
2. ✅ **URL absoluta do GitHub** - `https://raw.githubusercontent.com/wesleyxmns/kanbase/main/assets/kanbase.png`

## Se ainda não funcionar no NPM

### Opção 1: Aguardar Cache
O NPM pode levar algumas horas para atualizar o README. Aguarde e verifique novamente.

### Opção 2: Publicar Nova Versão
Após as alterações, publique uma nova versão:

```bash
npm version patch
npm publish
```

### Opção 3: Usar CDN Alternativo
Se o GitHub não funcionar, você pode:

1. Fazer upload da imagem para um CDN (ex: imgur, cloudinary)
2. Ou usar o caminho relativo (mas isso só funciona quando o pacote é baixado, não na visualização online do NPM)

### Opção 4: Verificar Restrições do NPM
O NPM pode bloquear certos domínios. Verifique se há alguma política de segurança bloqueando `raw.githubusercontent.com`.

## Status Atual

- ✅ Imagem incluída no pacote (`assets/kanbase.png`)
- ✅ URL do GitHub funcionando (testado com curl)
- ✅ README atualizado
- ⏳ Aguardando atualização do cache do NPM ou nova publicação

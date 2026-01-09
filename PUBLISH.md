# Guia de Publicação no NPM

## ✅ Status Atual

- ✅ Build concluído com sucesso
- ✅ Pacote validado (186.7 kB)
- ✅ Todos os arquivos necessários estão no `dist/`
- ⚠️ Você precisa fazer login no npm

## 📋 Passos para Publicar

### 1. Fazer Login no NPM

```bash
npm login
```

Você será solicitado a inserir:
- **Username**: Seu usuário do npm
- **Password**: Sua senha do npm
- **Email**: Seu email (público)
- **OTP**: Código de autenticação de dois fatores (se habilitado)

**Nota:** Se você não tem uma conta no npm, crie uma em: https://www.npmjs.com/signup

### 2. Verificar se está logado

```bash
npm whoami
```

Deve retornar seu username do npm.

### 3. Verificar o pacote antes de publicar (opcional)

```bash
npm pack --dry-run
```

Isso mostra o que será publicado sem criar o arquivo .tgz.

### 4. Publicar o pacote

```bash
npm publish
```

**Importante:** 
- O nome `kanbase` está disponível (verificado)
- Esta é a versão `0.0.1` (primeira publicação)
- Após publicar, o pacote estará disponível em: https://www.npmjs.com/package/kanbase

### 5. Verificar a publicação

Após alguns minutos, verifique:
```bash
npm view kanbase
```

Ou acesse: https://www.npmjs.com/package/kanbase

## 🔄 Para Publicar Atualizações Futuras

1. Atualize a versão no `package.json`:
   ```bash
   npm version patch  # 0.0.1 -> 0.0.2
   npm version minor  # 0.0.1 -> 0.1.0
   npm version major  # 0.0.1 -> 1.0.0
   ```

2. Faça o build:
   ```bash
   npm run build
   ```

3. Publique:
   ```bash
   npm publish
   ```

## 📦 Conteúdo do Pacote

O pacote inclui:
- ✅ `dist/kanbase.es.js` - ES Module
- ✅ `dist/kanbase.umd.js` - UMD (browser)
- ✅ `dist/index.d.ts` - Tipos TypeScript
- ✅ `dist/assets/kanbase.png` - Logo
- ✅ `README.md` - Documentação
- ✅ `package.json` - Metadados

## ⚠️ Importante

- Certifique-se de que o nome `kanbase` está disponível (já verificado ✅)
- A primeira publicação é pública por padrão
- Após publicar, você não pode deletar o pacote, apenas despublicar versões específicas
- Use versionamento semântico (SemVer) para futuras atualizações

## 🚀 Comando Rápido

```bash
npm login && npm publish
```

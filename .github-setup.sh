#!/bin/bash
# Script para configurar o repositório remoto do GitHub
# Uso: ./github-setup.sh <seu-usuario-github> <nome-do-repositorio>

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "❌ Erro: Você precisa fornecer o usuário do GitHub e o nome do repositório"
  echo "Uso: ./github-setup.sh <usuario-github> <nome-repositorio>"
  echo "Exemplo: ./github-setup.sh wesleyximenes kanbase"
  exit 1
fi

GITHUB_USER=$1
REPO_NAME=$2
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "🚀 Configurando repositório remoto..."
echo "📦 Repositório: ${REPO_URL}"

# Adicionar remote
git remote add origin ${REPO_URL} 2>/dev/null || git remote set-url origin ${REPO_URL}

echo "✅ Remote 'origin' configurado: ${REPO_URL}"
echo ""
echo "📝 Próximos passos:"
echo "1. Crie o repositório no GitHub: https://github.com/new"
echo "   - Nome: ${REPO_NAME}"
echo "   - Descrição: High-performance Kanban component for React"
echo "   - Visibilidade: Público ou Privado (sua escolha)"
echo "   - NÃO inicialize com README, .gitignore ou license (já temos)"
echo ""
echo "2. Após criar, execute:"
echo "   git push -u origin main"
echo ""
echo "Ou execute este script novamente após criar o repositório."

# GPE - Gestão de Projetos Escolares

Criado por António Pedro para gerir os projetos dele na escola, para ficar mais fácil as coisas.

Este repositório contém a infraestrutura de backend e banco de dados para a plataforma. **O frontend encontra-se atualmente em desenvolvimento.**

## Estrutura do Repositório

- `backend/`: API construída em Node.js com Express e TypeScript.
- `database/`: Scripts SQL para criação de tabelas e inserção de dados no PostgreSQL.

## Configuração do Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente baseando-se no ficheiro `.env.example` (certifique-se de configurar a conexão com a base de dados PostgreSQL).

4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

## Base de Dados

Os ficheiros da base de dados encontram-se na pasta `database/`. Poderá importar o `schema.sql` diretamente para o seu servidor PostgreSQL para recriar as tabelas do sistema.

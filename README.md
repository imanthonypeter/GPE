# GPE - Gestão de Projetos Escolares

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)

O **GPE** (Gestão de Projetos Escolares) é uma plataforma moderna concebida para simplificar a colaboração, organização e avaliação de projetos no ambiente académico. Facilita a comunicação entre alunos, professores e líderes de projeto, proporcionando um fluxo de trabalho claro e centralizado.

---

## 🌟 Funcionalidades Principais

- **Autenticação Robusta**: Perfis seguros para Alunos, Professores e Líderes.
- **Gestão de Projetos e Fases**:
  - Criação rápida de projetos.
  - Definição e acompanhamento de fases (Abertas/Fechadas).
  - Conclusão e arquivamento de projetos terminados.
- **Gestão de Equipas**:
  - Adição, edição e remoção de membros com papéis específicos (Frontend, Backend, Designer, etc.).
- **Avaliação Contínua**: Ferramentas para avaliar o desempenho individual em cada fase.
- **Dashboard Intuitivo**: Interface de utilizador moderna, responsiva e focada na experiência do utilizador.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Shadcn UI
- **Estado/Fetching**: React Query (TanStack Query)
- **Ícones**: Lucide React

### Backend
- **Ambiente**: Node.js
- **Framework**: Express.js
- **Base de Dados**: PostgreSQL (gerido com `pg`)
- **Autenticação**: JSON Web Tokens (JWT)
- **Uploads**: Multer

---

## ⚙️ Instalação e Configuração

Para executar este projeto localmente, siga os passos abaixo.

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) instalado e a correr.

### 2. Configurar a Base de Dados
Crie uma base de dados no PostgreSQL (por exemplo, `gpe`).
Na pasta `backend`, utilize os scripts `.sql` fornecidos para criar as tabelas e dados iniciais (se aplicável).

### 3. Configurar o Backend
```bash
cd backend
npm install
# Copie o ficheiro de exemplo para criar as variáveis de ambiente reais
cp .env.example .env
```
Edite o ficheiro `.env` com as suas credenciais do PostgreSQL e inicie o servidor:
```bash
npm run dev
```
O backend estará a correr em `http://localhost:3001`.

### 4. Configurar o Frontend
Num novo terminal, vá para a raiz do projeto:
```bash
npm install
```
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O frontend estará acessível em `http://localhost:3000`.

---

## 📁 Estrutura do Projeto

```
/
├── app/               # Rotas e páginas do Next.js (Dashboard, Profile, Projects, etc.)
├── backend/           # API em Node.js/Express
│   ├── src/           # Controladores, Rotas e Configurações de BD
│   └── uploads/       # Armazenamento local de avatares/ficheiros
├── components/        # Componentes Reutilizáveis (UI, Navbar, Modais)
├── hooks/             # Custom Hooks do React (Gestão de Estado com React Query)
├── lib/               # Funções utilitárias e chamadas à API (api.ts)
├── public/            # Assets estáticos (Imagens, Logos)
└── types/             # Definições de tipos TypeScript
```

---

## 🤝 Contribuição

Este projeto foi desenvolvido como parte de um requisito académico. Contribuições, *issues* e *feature requests* são bem-vindos.

1. Faça um Fork do projeto.
2. Crie uma *Branch* para a sua funcionalidade (`git checkout -b feature/NovaFuncionalidade`).
3. Faça *Commit* das suas alterações (`git commit -m 'Adiciona NovaFuncionalidade'`).
4. Faça *Push* para a *Branch* (`git push origin feature/NovaFuncionalidade`).
5. Abra um *Pull Request*.

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Veja o ficheiro `LICENSE` para mais informações.

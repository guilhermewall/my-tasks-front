# MyTasks Frontend

Aplicação frontend para gerenciamento de tarefas desenvolvida com Next.js 15, TypeScript, React Query e shadcn/ui.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React Query (TanStack Query)** - Gerenciamento de estado assíncrono
- **Zod** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários
- **shadcn/ui** - Componentes UI com Tailwind CSS
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 20 ou superior
- npm ou yarn
- Backend API rodando (https://my-tasks-api-qam1.onrender.com)

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/guilhermewall/my-tasks-front.git
cd my-tasks-front
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações:

```env
MY_TASKS_API_URL=https://my-tasks-api-qam1.onrender.com
COOKIE_DOMAIN=localhost
```

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa o linter

## 🏗️ Estrutura do Projeto

```
├── app/
│   ├── (auth)/              # Rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Rotas protegidas
│   │   ├── tasks/
│   │   └── layout.tsx
│   ├── api/                 # Route Handlers (BFF)
│   │   ├── auth/
│   │   └── tasks/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── forms/              # Formulários
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── TaskForm.tsx
│   ├── tasks/              # Componentes de tarefas
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskStatusBadge.tsx
│   │   └── TaskPriorityBadge.tsx
│   └── ui/                 # Componentes shadcn/ui
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   ├── useTasks.ts
│   └── use-toast.ts
├── lib/                    # Utilitários
│   ├── auth-cookies.ts
│   ├── env.ts
│   ├── fetcher.ts
│   ├── query-keys.ts
│   ├── utils.ts
│   └── zod-schemas.ts
├── services/              # Camada de serviços
│   ├── auth.service.ts
│   └── tasks.service.ts
├── domain/                # Tipos de domínio
│   ├── task.ts
│   └── user.ts
└── middleware.ts          # Middleware de autenticação
```

## 🔐 Arquitetura

### BFF (Backend for Frontend)

A aplicação utiliza Next.js Route Handlers como BFF (Backend for Frontend), criando uma camada intermediária entre o frontend e a API backend:

- **Route Handlers** (`app/api/*`) - Proxy para a API backend
- **httpOnly Cookies** - Armazenamento seguro de tokens JWT
- **Server-side validation** - Validação com Zod nos handlers

### Camadas da Aplicação

1. **UI Layer** (`components/`, `app/`)

   - Componentes React com shadcn/ui
   - Páginas com App Router
   - Formulários com react-hook-form

2. **State Management** (`hooks/`)

   - React Query para cache e sincronização
   - Custom hooks para auth e tasks
   - Invalidação automática de cache

3. **Service Layer** (`services/`)

   - Abstração de chamadas à API local
   - Client-side services

4. **BFF Layer** (`app/api/`)

   - Route Handlers como proxy
   - Gerenciamento de cookies
   - Validação de requests

5. **Domain Layer** (`domain/`, `lib/`)
   - Tipos TypeScript puros
   - Schemas Zod para validação
   - Utilitários compartilhados

## 🎯 Funcionalidades

### Autenticação

- ✅ Login com email e senha
- ✅ Registro de nova conta
- ✅ Logout com limpeza de sessão
- ✅ Refresh token automático
- ✅ Middleware de proteção de rotas

### Gerenciamento de Tarefas

- ✅ Listar tarefas com filtros
- ✅ Criar nova tarefa
- ✅ Editar tarefa existente
- ✅ Atualizar status (pendente/concluída)
- ✅ Excluir tarefa
- ✅ Definir prioridade (baixa/média/alta)
- ✅ Definir data de vencimento
- ✅ Busca por texto
- ✅ Filtro por status
- ✅ Ordenação (mais recentes/antigas)
- ✅ Paginação com cursor

### UI/UX

- ✅ Design responsivo
- ✅ Dark mode ready (sistema)
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Modais para criar/editar
- ✅ Formatação de datas relativas (pt-BR)
- ✅ Indicador de tarefas vencidas

## 🌐 API Backend

A aplicação consome a API: `https://my-tasks-api-qam1.onrender.com`

Endpoints disponíveis:

- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout
- `GET /auth/me` - Usuário atual
- `GET /tasks` - Listar tarefas
- `POST /tasks` - Criar tarefa
- `GET /tasks/:id` - Detalhe da tarefa
- `PATCH /tasks/:id` - Atualizar tarefa
- `PATCH /tasks/:id/status` - Atualizar status
- `DELETE /tasks/:id` - Excluir tarefa

## 🔒 Segurança

- Tokens JWT armazenados em **httpOnly cookies**
- Validação de dados com **Zod**
- Middleware de autenticação
- CSRF protection via cookies
- Variáveis de ambiente para configuração sensível

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Tema

Utiliza o sistema de temas do shadcn/ui com variáveis CSS:

- Suporta dark mode (baseado no sistema)
- Customizável via `globals.css`
- Paleta de cores consistente

## 🐛 Debugging

Para debug, ative as ferramentas do React Query:

```tsx
// app/providers.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Adicione no componente Providers:
<ReactQueryDevtools initialIsOpen={false} />;
```

## 📄 Licença

Este projeto foi desenvolvido como parte de um sistema de gerenciamento de tarefas.

## 👤 Autor

Desenvolvido para o projeto MyTasks

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

Feito com ❤️ usando Next.js e shadcn/ui

# Guia de Deploy - MyTasks Frontend

Este guia fornece instruções detalhadas para fazer deploy da aplicação MyTasks Frontend em diferentes plataformas.

## 📋 Pré-requisitos

- Conta no serviço de hospedagem escolhido (Vercel, Netlify, etc)
- Repository Git configurado
- Variáveis de ambiente configuradas
- Build testado localmente

## 🚀 Deploy na Vercel (Recomendado)

A Vercel é a plataforma recomendada por ser otimizada para Next.js.

### Passo 1: Preparar o Projeto

1. Verifique se o build está funcionando:

```bash
npm run build
npm start
```

2. Commit e push para o GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Passo 2: Conectar com Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Add New Project"
4. Selecione o repositório `my-tasks-front`
5. Clique em "Import"

### Passo 3: Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```env
MY_TASKS_API_URL=https://my-tasks-api-qam1.onrender.com
COOKIE_DOMAIN=.vercel.app
```

**Importante:** Para produção com domínio customizado, ajuste `COOKIE_DOMAIN` para seu domínio.

### Passo 4: Configurar Build

Vercel detecta automaticamente Next.js. Configurações padrão:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Passo 5: Deploy

1. Clique em "Deploy"
2. Aguarde o build (geralmente 2-3 minutos)
3. Acesse a URL fornecida (ex: `my-tasks-front.vercel.app`)

### Configurações Adicionais (Opcional)

#### Domínio Customizado

1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Atualize `COOKIE_DOMAIN` nas variáveis de ambiente

#### Proteção de Preview

1. Settings > Deployment Protection
2. Ative "Vercel Authentication"

## 🌐 Deploy na Netlify

### Passo 1: Preparar Configuração

Crie `netlify.toml` na raiz do projeto:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

### Passo 2: Conectar com Netlify

1. Acesse [netlify.com](https://netlify.com)
2. "Add new site" > "Import an existing project"
3. Selecione GitHub e o repositório
4. Configure as variáveis de ambiente:

```env
MY_TASKS_API_URL=https://my-tasks-api-qam1.onrender.com
COOKIE_DOMAIN=.netlify.app
```

5. Clique em "Deploy site"

## 🐳 Deploy com Docker

### Dockerfile

Crie `Dockerfile` na raiz:

```dockerfile
FROM node:20-alpine AS base

# Dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Crie `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MY_TASKS_API_URL=https://my-tasks-api-qam1.onrender.com
      - COOKIE_DOMAIN=localhost
    restart: unless-stopped
```

### Comandos Docker

```bash
# Build
docker build -t my-tasks-front .

# Run
docker run -p 3000:3000 \
  -e MY_TASKS_API_URL=https://my-tasks-api-qam1.onrender.com \
  -e COOKIE_DOMAIN=localhost \
  my-tasks-front

# Docker Compose
docker-compose up -d
```

## ⚙️ Otimizações de Produção

### next.config.ts

Adicione otimizações:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações
  reactStrictMode: true,
  poweredByHeader: false,

  // Compressão
  compress: true,

  // Build output
  output: "standalone", // Para Docker

  // Análise de bundle (opcional)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.alias = {
  //       ...config.resolve.alias,
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
```

### Análise de Bundle

```bash
# Instalar
npm install -D @next/bundle-analyzer

# Analisar
ANALYZE=true npm run build
```

## 🔐 Checklist de Segurança

- [ ] Variáveis de ambiente configuradas
- [ ] Tokens em httpOnly cookies
- [ ] HTTPS habilitado
- [ ] CORS configurado no backend
- [ ] Rate limiting no backend
- [ ] Validação de dados com Zod
- [ ] Sanitização de inputs
- [ ] Headers de segurança configurados

### Headers de Segurança

Adicione em `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ];
}
```

## 📊 Monitoramento

### Vercel Analytics

Instale o pacote:

```bash
npm install @vercel/analytics
```

Adicione no layout:

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

Configure conforme [documentação oficial](https://docs.sentry.io/platforms/javascript/guides/nextjs/).

## 🔄 CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          MY_TASKS_API_URL: ${{ secrets.MY_TASKS_API_URL }}
          COOKIE_DOMAIN: ${{ secrets.COOKIE_DOMAIN }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## 🐛 Troubleshooting

### Erro: "Module not found"

- Execute `npm install` novamente
- Limpe cache: `rm -rf .next node_modules && npm install`

### Erro de ambiente

- Verifique se todas as variáveis estão configuradas
- Reinicie o servidor após mudanças

### Build timeout

- Aumente timeout na plataforma
- Otimize dependências
- Use cache de build

### Cookies não funcionam

- Verifique `COOKIE_DOMAIN`
- Certifique-se que HTTPS está habilitado
- Verifique configuração CORS no backend

## 📝 Logs

### Vercel

- Acesse o dashboard do projeto
- Aba "Deployments" > Clique no deployment > "View Function Logs"

### Netlify

- Dashboard > Deploys > Clique no deploy > "Deploy log"

### Docker

```bash
docker logs <container-id>
docker logs -f my-tasks-front  # Follow
```

## 🎯 Performance

### Lighthouse Score Alvo

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

### Otimizações Implementadas

- ✅ Code splitting automático
- ✅ Image optimization (Next.js Image)
- ✅ Font optimization
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Tree shaking
- ✅ Lazy loading de componentes

## 🌍 Ambientes

### Development

```env
MY_TASKS_API_URL=http://localhost:8000
COOKIE_DOMAIN=localhost
```

### Staging (opcional)

```env
MY_TASKS_API_URL=https://staging-api.example.com
COOKIE_DOMAIN=.staging.example.com
```

### Production

```env
MY_TASKS_API_URL=https://my-tasks-api-qam1.onrender.com
COOKIE_DOMAIN=.example.com
```

## 📞 Suporte

Em caso de problemas durante o deploy:

1. Verifique logs da plataforma
2. Teste build local
3. Confirme variáveis de ambiente
4. Verifique conectividade com backend API
5. Consulte documentação da plataforma

---

**Deploy bem-sucedido! 🚀**

Acesse sua aplicação e comece a gerenciar suas tarefas!

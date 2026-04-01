# Onda Finance

Aplicação web de gestão financeira pessoal, desenvolvida como desafio técnico front-end.

🔗 **[Acesse a aplicação ao vivo →](https://onda-finance-eight.vercel.app/)**

---

## Sumário

- [Como rodar o projeto](#como-rodar-o-projeto)
- [Decisões técnicas](#decisões-técnicas)
- [Funcionalidades](#funcionalidades)
- [Testes](#testes)
- [Segurança](#segurança)
- [Melhorias futuras](#melhorias-futuras)

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/onda-finance.git
cd onda-finance

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em [http://localhost:5173](http://localhost:5173).

### Outros scripts

```bash
npm run build      # Build de produção
npm run preview    # Visualiza o build localmente
npm run test       # Roda os testes com Vitest
npm run test:ui    # Interface gráfica do Vitest
```

### Credenciais de teste

Use qualquer combinação válida:
- **Email:** qualquer e-mail válido (ex: `user@teste.com`)
- **Senha:** mínimo 6 caracteres

---

## Decisões técnicas

### Stack

| Tecnologia | Motivo |
|---|---|
| **React + TypeScript** | Tipagem estática elimina classes inteiras de bugs em runtime; autocomplete acelera desenvolvimento |
| **Vite** | Build tool mais rápida para React; HMR praticamente instantâneo |
| **Tailwind CSS** | Utilidades atômicas permitem estilização sem sair do JSX; evita CSS global desorganizado |
| **CVA (Class Variance Authority)** | Componentes com variantes tipadas (ex: `TransactionBadge`) sem condicional manual de classes |
| **shadcn/ui + Radix** | Componentes acessíveis (ARIA, keyboard navigation) sem overhead de CSS framework externo |
| **React Router v6** | Roteamento declarativo; `createBrowserRouter` com rotas aninhadas para o layout protegido |
| **React Query** | Gerenciamento de server state com cache, revalidação e `invalidateQueries` após mutações |
| **Zustand** | Store mínimo para auth; `persist` middleware garante sessão após refresh sem configuração extra |
| **React Hook Form + Zod** | Formulários performáticos (sem re-render por keystroke) com validação de schema tipada |
| **Axios** | Interceptors permitem injetar headers (`x-user`) globalmente; mock adapter simula API real |
| **Vitest** | Compatível com Vite nativamente; sem config extra; API idêntica ao Jest |

### Arquitetura

```
src/
├── app/
│   └── routes/           # Configuração de rotas + ProtectedRoute
├── components/           # Componentes reutilizáveis
│   └── ui/               # Componentes shadcn/ui
├── layouts/
│   └── AppLayout/        # Layout autenticado com sidebar
├── lib/
│   └── api.ts            # Axios instance + mock adapter
├── pages/
│   ├── login/
│   └── dashboard/
│   └── transfer/
├── schemas/              # Schemas Zod
├── services/             # Camada de acesso a dados (transactions)
└── store/                # Zustand stores
```

### Mock de API com Axios

Em vez de chamar `localStorage` diretamente nos serviços, toda comunicação passa pelo `api` (instância Axios). Um **custom adapter** intercepta as requisições e:

1. Simula latência de rede (~350ms) para comportamento realista
2. Persiste dados no `localStorage` como banco de dados em memória
3. Responde com status HTTP corretos (200, 201, 401, 404)
4. Lê o header `x-user` para isolar dados por usuário

Isso permite substituir o adapter por chamadas HTTP reais sem alterar nenhum serviço ou componente.

### Proteção de rotas

`ProtectedRoute` lê o estado do `useAuthStore`. Se não houver usuário autenticado, redireciona para `/login`. A sessão é mantida via `zustand/middleware/persist` no `localStorage`.

---

## Funcionalidades

- **Login** com validação via Zod (e-mail válido + senha ≥ 6 caracteres)
- **Persistência de sessão** — recarregar a página mantém o usuário logado
- **Dashboard** com saldo total, total de entradas e total de saídas
- **Lista de transações** por usuário autenticado
- **Nova transação** via modal (entrada ou saída)
- **Transferência** entre usuários — debita do remetente e credita no destinatário
- **Sidebar responsiva** com indicação de rota ativa
- **Logout** com limpeza de sessão

---

## Testes

### Login

-   Renderização
-   Validação
-   Fluxo completo

### Auth Store

-   Estado inicial
-   Login
-   Logout

### Dashboard

-   Renderização dos cards
-   Cálculo de saldo
-   Lista de transações
-   Estado vazio

### Transferência

-   Renderização
-   Validação
-   Submissão com sucesso

---

## Segurança

> A aplicação atual é um MVP com dados mockados. Em produção, as seguintes medidas seriam implementadas:

### Engenharia reversa

**Problema:** O código JavaScript entregue ao browser pode ser lido e analisado por qualquer pessoa.

**Mitigações:**

- **Ofuscação e minificação** — Vite + Rollup já minificam em produção. Para ofuscação adicional, ferramentas como `javascript-obfuscator` podem ser integradas ao build.
- **Variáveis de ambiente** — Chaves de API e segredos nunca devem estar no bundle do front-end. Devem viver exclusivamente em variáveis de ambiente do servidor (`process.env` no backend).
- **Lógica sensível no servidor** — Cálculos de saldo, autorização de transações e regras de negócio críticas devem existir apenas na API. O front-end é sempre não confiável.
- **CSP (Content Security Policy)** — Headers HTTP que restringem quais scripts podem ser executados, prevenindo execução de código injetado.

### Vazamento de dados

**Problema:** Dados do usuário podem ser expostos via rede, logs ou vulnerabilidades de XSS/CSRF.

**Mitigações:**

- **HTTPS obrigatório** — Toda comunicação entre cliente e servidor deve ser criptografada via TLS. Em produção, redirecionar HTTP → HTTPS via HSTS.
- **Tokens JWT com expiração curta** — Autenticação via access token (15min) + refresh token (7 dias) em cookies `HttpOnly; Secure; SameSite=Strict`. Cookies `HttpOnly` não são acessíveis via JavaScript, neutralizando XSS.
- **Sanitização de inputs** — Nunca confiar em dados do usuário. Validar no front (Zod) E no back-end. Usar ORM com prepared statements para prevenir SQL injection.
- **Rate limiting** — Limitar tentativas de login por IP para prevenir brute force.
- **Logs sem PII** — Logs de aplicação nunca devem conter senhas, tokens ou dados pessoais sensíveis.
- **CORS restrito** — Configurar `Access-Control-Allow-Origin` apenas para domínios conhecidos.

---

## Melhorias futuras

- [ ] **Paginação / scroll infinito** na lista de transações
- [ ] **Filtros e busca** por tipo, data e valor
- [ ] **Gráfico de evolução** do saldo ao longo do tempo (Recharts)
- [ ] **Categorias de transação** (alimentação, transporte, lazer...)
- [ ] **Exportação CSV/PDF** do extrato
- [ ] **Autenticação real** com JWT + refresh token
- [ ] **Testes E2E** com Playwright
- [ ] **Dark/Light mode toggle**
- [ ] **PWA** para uso offline e instalação no celular
- [ ] **Internacionalização (i18n)** com `react-i18next`
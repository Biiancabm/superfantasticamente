# Sistema de Gerenciamento de Clientes

Front-end React moderno para gerenciar clientes do backend NestJS.

## 🚀 Funcionalidades

- ✅ **Listar** todos os clientes
- ✅ **Criar** novos clientes
- ✅ **Editar** clientes existentes
- ✅ **Deletar** clientes
- ✅ **Buscar** clientes similares (usando embeddings)
- ✅ Design moderno com glassmorphism
- ✅ Animações suaves
- ✅ Responsivo para mobile e desktop
- ✅ Notificações de sucesso/erro

## 📋 Pré-requisitos

- Node.js 20.19+ ou 22.12+ (recomendado)
- Backend NestJS rodando em `http://localhost:3000`

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🎨 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ClientCard.tsx   # Card individual de cliente
│   ├── ClientForm.tsx   # Formulário de criar/editar
│   └── Modal.tsx        # Modal reutilizável
├── pages/
│   └── Home.tsx         # Página principal
├── services/
│   └── api.ts           # Serviço de API
├── types/
│   └── client.ts        # TypeScript types
└── index.css            # Estilos globais

```

## 🔌 Integração com Backend

O front-end se conecta ao backend NestJS através dos seguintes endpoints:

- `GET /clients` - Listar todos os clientes
- `GET /clients/:code` - Buscar cliente por código
- `POST /clients` - Criar novo cliente
- `PATCH /clients/:code` - Atualizar cliente
- `DELETE /clients/:code` - Deletar cliente
- `GET /clients/fodastico/:name` - Buscar clientes similares

## 📝 Estrutura de Dados

```typescript
interface Client {
  code: string;      // Código único do cliente
  name: string;      // Nome completo
  email: string;     // Email
  phone: string;     // Telefone
  cpf: string;       // CPF
}
```

## 🎯 Como Usar

### 1. Iniciar o Backend NestJS

Certifique-se de que o backend está rodando:

```bash
cd C:\Users\Bianca\Dev\superfantasticamente
npm run start:dev
```

### 2. Iniciar o Frontend React

```bash
cd C:\Users\Bianca\Dev\react-front-end
npm run dev
```

### 3. Acessar a Aplicação

Abra o navegador em `http://localhost:5173`

## ✨ Funcionalidades Detalhadas

### Adicionar Cliente
1. Clique no botão "Novo Cliente"
2. Preencha o formulário (código e nome são obrigatórios)
3. Clique em "Criar"

### Editar Cliente
1. Clique no botão "Editar" no card do cliente
2. Modifique os campos desejados
3. Clique em "Atualizar"

### Deletar Cliente
1. Clique no botão "Deletar" no card do cliente
2. Confirme a ação

### Buscar Clientes Similares
1. Digite um nome na barra de busca
2. Pressione Enter ou clique em "Buscar"
3. O sistema usará embeddings para encontrar clientes similares

## 🎨 Design System

O projeto usa um design system moderno com:

- **Cores**: Paleta dark com gradientes vibrantes
- **Glassmorphism**: Efeitos de vidro fosco
- **Animações**: Transições suaves e micro-interações
- **Tipografia**: Inter font family
- **Responsividade**: Mobile-first design

## 🔧 Configuração

Para alterar a URL do backend, edite o arquivo `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000'; // Altere aqui
```

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`

## 🐛 Troubleshooting

### Backend não conecta
- Verifique se o backend NestJS está rodando
- Confirme que CORS está habilitado no backend
- Verifique a URL da API em `src/services/api.ts`

### Erros de TypeScript
- Execute `npm install` novamente
- Verifique a versão do Node.js

## 📄 Licença

Este projeto foi criado para demonstração de CRUD com React e NestJS.

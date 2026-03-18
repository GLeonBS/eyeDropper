# EyeDropper

Aplicação para selecionar cores da tela usando a [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API), com histórico da cor atual/anterior e persistência local.

O repositório agora suporta dois alvos:

- **Web App** (Vite + React) para deploy no GitHub Pages
- **Chrome Extension (Popup)** com layout otimizado para `380px`

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- ESLint (flat config)

## Estrutura do projeto

- `src/`: app principal (web e popup compartilham a mesma base)
- `public/`: assets estáticos e `manifest.json` da extensão
- `old/`: versão legada (não é o app principal)

## Requisitos

- Node.js 20+ (recomendado)
- npm 10+
- Google Chrome (para testar a extensão)

## Instalação

```bash
npm install
```

## Scripts disponíveis

```bash
# Desenvolvimento web
npm run dev

# Build web (GitHub Pages)
npm run build

# Preview local do build web
npm run preview

# Deploy web para GitHub Pages
npm run deploy

# Build da extensão Chrome (MV3)
npm run build:extension

# Lint
npm run lint
```

## Rodando o app web

```bash
npm run dev
```

Abra a URL exibida no terminal (normalmente `http://localhost:5173`).

## Deploy no GitHub Pages

O deploy web continua ativo e separado da extensão.

```bash
npm run build
npm run deploy
```

## Extensão Chrome (Popup)

### 1) Gerar build da extensão

```bash
npm run build:extension
```

O build é gerado em `dist-extension/`.

### 2) Carregar no Chrome

1. Abra `chrome://extensions`
2. Ative **Modo do desenvolvedor**
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `dist-extension`

### 3) Atualizar depois de mudanças

- Rode novamente `npm run build:extension`
- Clique em **Recarregar** no card da extensão

## Ícones da extensão

Os ícones usados no Chrome ficam em:

- `public/icons/icon-16.png`
- `public/icons/icon-32.png`
- `public/icons/icon-48.png`
- `public/icons/icon-128.png`

Configuração no manifesto:

- `public/manifest.json`

## Compatibilidade da EyeDropper API

- A API exige ação do usuário (clique no botão).
- Pode não estar disponível em alguns navegadores/contextos.
- Quando indisponível, o app exibe mensagem de erro ao usuário.

## Persistência de dados

O projeto usa `localStorage` para salvar:

- cor atual (`corSelecionada`)
- cor anterior (`corAnterior`)
- tipo de fundo (`backgroundType`)

## Validação recomendada antes de PR

```bash
npx eslint src/App.tsx src/main.tsx vite.config.ts
npm run build
npm run build:extension
```

## Observações sobre lint

Atualmente, `npm run lint` pode reportar erros na pasta legada `old/` que já existiam antes das mudanças do app principal.

## Licença

Projeto para fins educacionais/portfólio.

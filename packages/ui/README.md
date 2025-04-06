# Token Management UI

A React-based user interface for managing ERC20 tokens.

## Features

- View token information (name, symbol, decimals, total supply)
- Transfer tokens between addresses
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v16 or later)
- Yarn package manager

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3001`.

## Building for Production

To build the application for production:

```bash
yarn build
```

The built files will be in the `dist` directory.

## Preview Production Build

To preview the production build:

```bash
yarn preview
```

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `services/` - API service functions
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
- `public/` - Static assets
- `index.html` - HTML template
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

## API Integration

The UI communicates with the API server running at `http://localhost:3000`. Make sure the API server is running before using the UI.

## Environment Variables

No environment variables are required for the UI package.

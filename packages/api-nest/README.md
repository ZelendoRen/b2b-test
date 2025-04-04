# Token API (NestJS)

A NestJS-based API for managing token operations on the blockchain.

## Features

- Token information retrieval
- Token transfers
- Rate limiting
- Swagger documentation
- Environment-based configuration

## Prerequisites

- Node.js (v16 or later)
- Yarn package manager
- Access to a blockchain node (local or remote)

## Installation

1. Install dependencies:

```bash
yarn install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Update the environment variables in `.env` as needed.

## Development

Start the development server:

```bash
yarn start:dev
```

The API will be available at `http://localhost:3000`.

## API Documentation

Swagger documentation is available at `http://localhost:3000/swagger`.

## Available Scripts

- `yarn start:dev`: Start the development server with hot-reload
- `yarn build`: Build the application
- `yarn start:prod`: Start the production server
- `yarn test`: Run tests
- `yarn test:watch`: Run tests in watch mode
- `yarn test:cov`: Run tests with coverage
- `yarn lint`: Run linter
- `yarn format`: Format code with Prettier

## Environment Variables

- `NODE_ENV`: Environment (local, dev, prod)
- `OPERATOR_PRIVATE_KEY`: Private key for token operations

## License

MIT

# B2B Test Project

This project consists of three main packages:

1. A blockchain package for smart contract development and testing
2. A Node JS API package for interacting with the blockchain
3. A Nest JS API package that pretty similar to Node JS

Important Notice: Technically tasks was done, but on Wednesday morning I've unexpectedly changed my location and could not implement all things that I actually want. But I try to describe it and maybe some of my ideas will help you to slightly improve your task

## Project Structure

```
b2b-test/
├── packages/
│   ├── api/               # NodeJS API for token operations
│   ├── api-nest/          # NestJS API for token operations
│   └── blockchain/        # Smart contracts and blockchain utilities
```

## Prerequisites

- Node.js (v16 or later)
- Yarn package manager
- Hardhat (for blockchain development)
- NestJS CLI (for API development)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd b2b-test
```

2. Install dependencies:

```bash
yarn install
```

## Blockchain Package

This was easiest part for me. I used hardhat-deploy plugin to make deployment more comfortable and maintainable. Also I used TypeScript. Test fully cover new functionality. In this project used OpenZeppelin library, so ERC20 base contract that we used is already tested. In contract, also I added public mint function, just to make simpler to get tokens on testnet

This project can deploy on any EVM chain. All you need to do is define new chain in hardhat.config and create new script/call commands manually with different --network param. I think it is awesome. I can talk a lot about cool features that provided by hardhat-deploy plugin, but let's move forward

### Features

- TestERC20 token contract
- Deployment scripts
- Testing utilities

### Setup

1. Copy the environment file:
   Create .env file in each package based on .env example. You can define both required and optional fields.

2. Start the development server:
   For api:

```bash
yarn api:start:dev
```

For api-nest:

```bash
yarn api-nest:start:dev
```

3. Access both APIs at `http://localhost:3000`. Of course if you are not running them together.

4. View API documentation at `http://localhost:3000/swagger`. Both packages implement swagger docs for more comfortable API usage.

## API Packages

These are two similar packages. In task marked that it should be node.js app. But even if we will use TS in it - it will be same. Much better to use Nest.js, because it supports TS from scratch and looks more pretty/maintainable. For my shame, I am not finished testing of Nest js app, so it work incorrect. Sorry for that, but I really never thought about something like this can be, especially at the same time with task execution.

### Features

#### Token information retrieval

I decided to save part of const data that not changed. So first call for this part of data will always get data from blockchain, but subsequent calls will use cached data.

- Token transfer operations
- Rate limiting
- Swagger documentation
- Environment-based configuration

### Setup

1. Copy the environment file:
   Create in each of package .env file based on .env example. It will be required field, and not. You can define only required

2. Start the development server:
   For api:

```bash
yarn api:start:dev
```

For api-nest:

```bash
yarn api-nest:start:dev
```

3. Access to both of the API at `http://localhost:3000`. Of course if you are not run it together

4. View API documentation at `http://localhost:3000/swagger`. Both packages implement swagger docs for more comfortable API working

## Environment Variables

### Blockchain Package

Required:

- `DEPLOYER_PRIVATE_KEY` - Private key for deployments (For local it is no matter which account you take. It used only on real deploy. For test takes account with index 0 from account list in node terminal. It prints on start)

Optional:

- `NODE_ENV` - Environment type (local, dev, prod). Default: local
- `RPC_URL` - RPC URL for the network. Default: http://localhost:8545 for local
- `ETHERSCAN_API_KEY` - API key for Etherscan verification (required for mainnet/testnet deployments)
- `REPORT_GAS` - Enable gas reporting in tests. Default: false
- `COINMARKETCAP_API_KEY` - API key for gas price estimation (optional)

### API Package (Node.js)

Required:

- `NODE_ENV` - Environment type (local, dev, prod)
- `OPERATOR_PRIVATE_KEY` - Private key for token operations (should be same as deployer for local development)

Optional:

- `PORT` - Port to run the API on. Default: 3000
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds. Default: 60000 (1 minute)
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window. Default: 100
- `LOG_LEVEL` - Logging level (error, warn, info, debug). Default: info
- `RPC_URL` - RPC URL for the network. Default: http://localhost:8545 for local

### API Package (NestJS)

Required:

- `NODE_ENV` - Environment type (local, dev, prod)
- `OPERATOR_PRIVATE_KEY` - Private key for token operations (should be same as deployer for local development)

Optional:

- `PORT` - Port to run the API on. Default: 3000
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds. Default: 60000 (1 minute)
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window. Default: 100
- `LOG_LEVEL` - Logging level (error, warn, info, debug). Default: info
- `RPC_URL` - RPC URL for the network. Default: http://localhost:8545 for local
- `SWAGGER_ENABLED` - Enable Swagger documentation. Default: true
- `CORS_ENABLED` - Enable CORS. Default: true
- `CORS_ORIGIN` - CORS origin. Default: \*

## How to make it work?

1. Create .env file and make sure that you define all required params
2. Run `yarn blockchain:setup` to prepare blockchain environment
3. Run `yarn api:start` or `yarn api-nest:start` to start API. Notice: Nest API may work with bugs
4. Open swagger UI and try out request

## About transfer from

So, main idea of actual function that you select someone who can operate some amount of your tokens. After you approve some token for operation by some account - this account can call tx to transfer your approved amount for someone else. The main issue is that we can not provide private key using http/https - it is bad practice and insecure. Other way, that we can do that - use already signed tx or message, to make proof wallet owner. But in fact it will be so complex for this task.
Current logic works with the following steps. You provide wallet that own tokens, wallet that should receive it and amount to transfer. Very important to make sure that `blockchain startup` executed without issues, because it automatically approve and mint tokens. Without that it will be impossible.
Maybe it is incorrect from my side, but I think that it will be better if in this task will be simple UI provided, without integration. And using it dev should sign some data using any wallet like MetaMask and verify/process data on backend. Yes, React/Angular is not required for this position, because that would need some prepared code. Backend dev may be not familiar with any FE language, but if it is Backend/Blockchain dev - he should be able to integrate blockchain support

# B2B Test Project

A monorepo project with blockchain, API, and UI components.

1. Blockchain package (Hardhat)
2. Node.js API package
3. NestJS API package
4. React UI package

## Project Structure

```
b2b-test/
├── packages/
│   ├── api/               # NodeJS API for token operations
│   ├── api-nest/          # NestJS API for token operations
│   ├── ui/                # React UI application
│   └── blockchain/        # Smart contracts and blockchain utilities
```

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Create .env file in each package and fill all required params
3. Start the blockchain node and deploy contracts:
   You can run fast setup that will up all needed services

```bash
yarn setup
```

Or you can run each service individually
3.1 Run blockchain service

```bash
yarn blockchain:setup
```

3.2 Run API service

```bash
yarn api:start:dev
```

3.3 Run UI component

```bash
yarn ui:start:dev
```

## Environment Variables

### Blockchain Package

Required:

- `PRIVATE_KEY`: Private key for deploying contracts
- `ACTION_ADDRESS`: Address of you wallet that you want interact with UI. On this address will mint tokens and transfer ETH for transaction sending

### Node.js API Package

Required:

- `PORT`: Port to run the API server on
- `TOKEN_ADDRESS`: Address of the deployed token contract

### NestJS API Package

Required:

- `PORT`: Port to run the API server on
- `TOKEN_ADDRESS`: Address of the deployed token contract

### UI Package

No environment variables required.

## Available Scripts

- `yarn blockchain:setup` - Start blockchain node and deploy contracts
- `yarn api:start:dev` - Start Node.js API server
- `yarn api-nest:start:dev` - Start NestJS API server
- `yarn ui:start:dev` - Start UI development server
- `yarn setup` - Make same as `blockchain:setup` but also run UI and API modules

## Development

## Blockchain Package

This was easiest part for me. I used hardhat-deploy plugin to make deployment more comfortable and maintainable. Also I used TypeScript. Test fully cover new functionality. In this project used OpenZeppelin library, so ERC20 base contract that we used is already tested. In contract, also I added public mint function, just to make simpler to get tokens on testnet

This project can deploy on any EVM chain. All you need to do is define new chain in hardhat.config and create new script/call commands manually with different --network param. I think it is awesome. I can talk a lot about cool features that provided by hardhat-deploy plugin, but let's move forward

### Features

- TestERC20 token contract
- Deployment scripts
- Testing utilities

## API Packages

These are two similar packages. In task marked that it should be node.js app. But even if we will use TS in it - it will be same. Much better to use Nest.js, because it supports TS from scratch and looks more pretty/maintainable. Nest project is more for sample. For UI interaction it used api on Node.js

### Features

#### Token information retrieval

I decided to save part of const data that not changed. So first call for this part of data will always get data from blockchain, but subsequent calls will use cached data.

- Token transfer operations
- Rate limiting
- Swagger documentation
- Environment-based configuration

View API documentation at `http://localhost:3000/swagger`. Both packages implement swagger docs for more comfortable API working

## About transfer from

So, main idea of actual function that you select someone who can operate some amount of your tokens. After you approve some token for operation by some account - this account can call tx to transfer your approved amount for someone else. The main issue is that we can not provide private key using http/https - it is bad practice and insecure. Other way, that we can do that - use already signed tx or message, to make proof wallet owner. But in fact it will be so complex for this task.
Current logic works with the following steps. You provide wallet that own tokens, wallet that should receive it and amount to transfer. Very important to make sure that `blockchain startup` executed without issues, because it automatically approve and mint tokens. Without that it will be impossible.
Maybe it is incorrect from my side, but I think that it will be better if in this task will be simple UI provided, without integration. And using it dev should sign some data using any wallet like MetaMask and verify/process data on backend. Yes, React/Angular is not required for this position, because that would need some prepared code. Backend dev may be not familiar with any FE language, but if it is Backend/Blockchain dev - he should be able to integrate blockchain support

## UI

This is part that I decided to do, because as I think task transfer is not cover all possible cases that need to transfer from and wallet interactions.

### Features

- Connect Wallet
- Automaticly add chain to wallet
- Get token info
- Mint function (mint is public in contract)
- Transfer tokens (just for simple transfer between account)
- Transfer from (for transfer tokens by backend)
- Approve tokens

#### Transfer from

In this implementation transfer from will work next

1. Get from input values for transaction
2. Ask user to sign transaction
3. Check sign on backend
4. Check allowance
5. Check actual balance of signer
6. Using backend wallet transfer tokens

Sign is very common way to identify blockchain address and proof that sender of any request is actual wallet owner

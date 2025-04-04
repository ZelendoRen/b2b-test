import { localhost, polygonAmoy } from 'viem/chains';
import * as contractInfoLocal from 'blockchain/deployments/localhost/TestERC20.json';
import { Address } from 'viem';

const CONTRACT_INFO = {
  LOCAL: contractInfoLocal,
  PROD: contractInfoLocal,
  DEV: contractInfoLocal,
};

const config = {
  blockchain: {
    contractAddress: CONTRACT_INFO[process.env.ENV?.toUpperCase() || 'LOCAL']?.address,
    operator: process.env.OPERATOR_PRIVATE_KEY,
    chain: process.env.ENV?.toLowerCase() === 'local' ? localhost : polygonAmoy,
    abi: {
      erc20: CONTRACT_INFO[process.env.ENV?.toUpperCase() || 'LOCAL']?.abi,
    },
  },
  api: {
    port: Number(process.env.PORT) || 3000,
    maxConcurrent: Number(process.env.MAX_CONCURRENT) || 1,
    minTime: Number(process.env.MIN_TIME) || 1000,
  },
};

export default config;

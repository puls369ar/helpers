import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import '@nomiclabs/hardhat-etherscan';

import "hardhat-deploy";
import "hardhat-deploy-ethers";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      }, 
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      }, 
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
     
      {
        version: "0.5.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 10000
  },
  etherscan: {
    apiKey: { 
        amoy: "3SYU2XD81JK14RXWECVMXTZ2M1JVK5GKGU", 
        fantom: "AZTJ36GVMVIV9FAJ5X4IW74MKIN33XV2VN", 
        polygon: "Z88T763JWZTI7R63F624996PBRV29XSNRA", 
        lif3chainTestnet: "leKDsYp3AKw7at1bQmd7fAue83kDTAf6" },
    customChains: [
      {
        network: 'fantom',
        chainId: 250,
        urls: {
          apiURL: 'https://api.ftmscan.com/api',
          browserURL: 'https://ftmscan.com',
          accounts: [],
        },
      },

      {
        network: 'amoy',
        chainId: 80002,
        urls: {
          apiURL: 'https://api-amoy.polygonscan.com/api',
          browserURL: 'https://amoy.polygonscan.com/',
          accounts: []
        },
      },
      {
        network: "polygon",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com",
          accounts: []
          
        },
      },
      {
        network: "bsc",
        chainId: 56,
        urls: {
          apiURL: "https://api.bscscan.com/api",
          browserURL: "https://bscscan.com",
          accounts: []

        },
      },
      {
        network: "lif3chain-testnet",
        chainId: 1811,
        urls: {
          apiURL: "https://testnet-api.lif3scout.com/api",
          browserURL: "https://testnet.lif3scout.com",
          accounts: []

        },
      },
      {
        network: "lif3chain-mainnet",
        chainId: 8869,
        urls: {
          apiURL: "https://lif3scout.com/api",
          browserURL: "https://lif3scout.com",
          accounts: []

        },
      },
    ],
  },
  
  
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: "https://polygon-rpc.com",
        blockNumber: 55521615,
      },
      deploy: ["deploy/hardhat"],
      tags: ["hardhat"],
    },
    polygon: {
      url: "https://polygon-rpc.com",
      chainId: 137,
      accounts: [`${String(process.env.DEPLOYER)}`],
      gasPrice: 400e9,
      deploy: ["deploy/polygon"],
      tags: ["polygon"],
    },
    fantom: {
      url: "https://rpc.ftm.tools",
      chainId: 250,
      accounts: [`${String(process.env.DEPLOYER)}`],
      gasPrice: 200e9,
    },
    amoy: {
      url:"https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: [`${String(process.env.DEPLOYER)}`],
      deploy: ["deploy/amoy"],
      tags: ["amoy"],
    },
    "lif3chain-testnet":{
      chainId: 1811,
      url: "https://testnet-evm.lif3.com",
      accounts: [`${String(process.env.DEPLOYER)}`],
      deploy: ["deploy/lif3chain-testnet"],
      tags: ["Lif3chain-testnet"]
    },
    "lif3chain-mainnet": {
      chainId: 8869,
      url: "https://rpc.lif3.com",
      accounts: [`${String(process.env.DEPLOYER)}`],
      deploy: ["deploy/lif3chain-mainnet"],
      tags: ["Lif3chain-mainnet"]
    },
  },

};
export default config;
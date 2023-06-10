import { LockliftConfig } from "locklift";
import { FactorySource } from "./build/factorySource";
require('dotenv').config();
const Blockchains = require('./configs/blockchains.json');

declare global {
  const locklift: import("locklift").Locklift<FactorySource>;
}

const LOCAL_NETWORK_ENDPOINT = process.env.NETWORK_ENDPOINT || "http://localhost/graphql";
const DEV_NET_NETWORK_ENDPOINT = process.env.DEV_NET_NETWORK_ENDPOINT || "https://devnet-sandbox.evercloud.dev/graphql";

const VENOM_TESTNET_ENDPOINT = Blockchains.venom_testnet.rpcUrl;
const VENOM_TESTNET_TRACE_ENDPOINT = Blockchains.venom_testnet.gqlUrl;

const VENOM_DEVNET_ENDPOINT = Blockchains.venom_devnet.rpcUrl;
const VENOM_DEVNET_TRACE_ENDPOINT = Blockchains.venom_devnet.explorer;

const LOCKLIFT_DEV_ADDRESS = process.env.VENOM_SERVICE_ADMIN_ADDRESS!;
const LOCKLIFT_DEV_PHRASE = process.env.VENOM_SERVICE_ADMIN_SID!;

// Create your own link on https://dashboard.evercloud.dev/
const MAIN_NET_NETWORK_ENDPOINT = process.env.MAIN_NET_NETWORK_ENDPOINT || "https://mainnet.evercloud.dev/XXX/graphql";

const config: LockliftConfig = {
  compiler: {
    version: "0.62.0",
    // externalContracts: {
    //   "node_modules/tip4/contracts/TIP4_3/compiled": ['Index', 'IndexBasis']
    // }
  },
  linker: {
    version: "0.15.48",
  },
  networks: {
    local: {
      connection: {
        id: 1,
        group: "localnet",
        type: "graphql",
        data: {
          endpoints: [LOCAL_NETWORK_ENDPOINT],
          latencyDetectionInterval: 1000,
          local: true,
        },
      },
      giver: {
        address: "0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415",
        key: "172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3",
      },
      tracing: {
        endpoint: LOCAL_NETWORK_ENDPOINT,
      },
      keys: {
        phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    },
    venom_testnet: {
      connection: {
        id: 1000,
        type: "jrpc",
        group: "testnet",
        data: {
          endpoint: VENOM_TESTNET_ENDPOINT,
        },
      },
      giver: {
        address: LOCKLIFT_DEV_ADDRESS,
        phrase: LOCKLIFT_DEV_PHRASE,
        accountId: 0,
      },
      tracing: {
        endpoint: VENOM_TESTNET_TRACE_ENDPOINT,
      },
      keys: {
        phrase: LOCKLIFT_DEV_PHRASE,
        amount: 20,
      },
    },
    venom_devnet: {
      connection: {
        id: 1002,
        type: "jrpc",
        group: "devnet",
        data: {
          endpoint: VENOM_DEVNET_ENDPOINT,
        },
      },
      giver: {
        address: LOCKLIFT_DEV_ADDRESS,
        phrase: LOCKLIFT_DEV_PHRASE,
        accountId: 0,
      },
      tracing: {
        endpoint: VENOM_DEVNET_TRACE_ENDPOINT,
      },
      keys: {
        phrase: LOCKLIFT_DEV_PHRASE,
        amount: 20,
      },
    }
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;

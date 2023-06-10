// import { ProviderRpcClient } from 'everscale-inpage-provider';
import venomwallet from "@/wallets/venomwallet"
const ABI = '@/contracts/ExampleContract.abi.json';
const base64Contract = '@/contracts/ExampleContract.base64';

// type DeployParams = GetExpectedAddressParams & {
//   publicKey: string | undefined;
// };

const provider = venomwallet.venomProvider;

async function deployCircleContract() {
  // Ensure the provider is initialized
  await provider.ensureInitialized();
  
  // Request permissions from the user to execute API methods using the provider
  await provider.requestPermissions({ permissions: ['basic', 'accountInteraction'] });
  
  const providerState = await provider.getProviderState();
  
  const senderPublicKey = providerState?.permissions.accountInteraction?.publicKey;
  const senderAddress = providerState?.permissions.accountInteraction?.address;
  
  const someParam = 1000;
  const secondParam = 'test';
  
  const deployParams = {
    tvc: base64Contract,
    workchain: 0,
    publicKey: senderPublicKey,
    initParams: {
      nonce: (Math.random() * 64000).toFixed(),
    },
  };
  // Get the expected contract address
  const expectedAddress = await provider.getExpectedAddress(ABI, deployParams);
  
  // Get the state init
  const stateInit = await provider.getStateInit(ABI, deployParams);
  
  // Define the constructor payload
  // const constructorPayload = {
  //   abi: JSON.stringify(ABI),
  //   method: 'constructor',
  //   params: {
  //     someParam: someParam.toString(),
  //     second: secondParam,
  //   },
  // };
  
  // Send the coins to the address
  await provider.sendMessage({
    sender: senderAddress,
    recipient: expectedAddress,
    amount: 1 * 10 ** 9, // 1 Coin in nanoсents
    bounce: false, // It is important to set 'bounce' to false to ensure funds remain in the contract.
  
    stateInit: stateInit.stateInit,
  });
  
  // Create a contract instance
  const exampleContract = new provider.Contract(ABI, expectedAddress);
  console.log(exampleContract);
  // Call the contract constructor
  await exampleContract.methods
    .constructor({
      someParam: someParam,
      second: secondParam,
    })
    .sendExternal({
      stateInit: stateInit.stateInit,
      publicKey: deployParams.publicKey,
    });
}

export default { deployCircleContract }

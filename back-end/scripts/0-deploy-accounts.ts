var fs = require('fs');
import { Address } from "locklift";

const AccountProfileContract = require('../configs/contracts/AccountProfileContract.json');
const serviceAddress = new Address(process.env.VENOM_SERVICE_CHARGE_ADDRESS!);

async function main() {
  
  try {
    const contractName = "AccountsContract";
  
    const signer = (await locklift.keystore.getSigner("0"))!;
  
    const { contract: accountsContract, tx } = await locklift.factory.deployContract({
      contract: contractName,
      publicKey: signer.publicKey,
      initParams: {
        // version: `R-${locklift.utils.getRandomNonce()}`,
        version: 'piltonet-com-v01',
        accountProfileContractCode: AccountProfileContract.code
      },
      constructorParams: {
        serviceAddress: serviceAddress
      },
      value: locklift.utils.toNano(0.2),
    });
  
    const contractAddress = accountsContract.address.toString();
    console.log(`${contractName} contract deployed at: ${contractAddress}`);

    // Create & Copy Jsons
    const artifacts = await locklift.factory.getContractArtifacts(contractName);
    const OBJ = {
      address: contractAddress,
      abi: artifacts.abi,
      tvc: artifacts.tvc,
      code: artifacts.code
    }
    const jsonData = JSON.stringify(OBJ);

    await fs.writeFileSync(`./configs/contracts/${contractName}.json`, jsonData);
    
    await fs.writeFileSync(`/Users/farokh/Desktop/piltonet-dev/development/venom/development/venom-front/src/contracts/${contractName}/${contractName}.json`, jsonData);
    // await fs.copyFileSync(
    //   `./contracts/Accounts/${contractName}.tsol`,
    //   `/Users/farokh/Desktop/piltonet-dev/development/venom/development/venom-front/src/contracts/${contractName}/${contractName}.tsol`
    // );
    console.log(`${contractName}.json created.`);
  } catch(err) {
    console.log(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });

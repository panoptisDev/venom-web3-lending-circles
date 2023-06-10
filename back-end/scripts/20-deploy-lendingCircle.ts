var fs = require('fs');
import { Address } from "locklift";

const serviceAddress = new Address(process.env.VENOM_SERVICE_CHARGE_ADDRESS!);

async function main() {
  
  try {
    const contractBase = "LendingCircleContract";
    const preVersion = "A01";
    const contractName = `${contractBase}${preVersion}`;
  
    const signer = (await locklift.keystore.getSigner("0"))!;
  
    const { contract: lendingCircleContract, tx } = await locklift.factory.deployContract({
      contract: contractName,
      publicKey: signer.publicKey,
      initParams: {
        version: `${preVersion}-${locklift.utils.getRandomNonce()}`,
        circleOwner: serviceAddress,
        serviceAddress: serviceAddress,
        nonce: locklift.utils.getRandomNonce()
      },
      constructorParams: {
        paymentToken: new Address("0:0000000000000000000000000000000000000000000000000000000000000000"),
        roundDays: 30,
        paymentType: 0,
        creatorEarnings_x10000: 0
      },
      value: locklift.utils.toNano(5),
    });
  
    const contractAddress = lendingCircleContract.address.toString();
    console.log(`${contractName} contract deployed at: ${contractAddress}`);

    // Create & Copy Jsons
    const artifacts = await locklift.factory.getContractArtifacts(contractName);
    const OBJ = {
      abi: artifacts.abi,
      tvc: artifacts.tvc,
      code: artifacts.code
    }
    const jsonData = JSON.stringify(OBJ);

    await fs.writeFileSync(`./configs/contracts/${contractName}.json`, jsonData);
    
    await fs.writeFileSync(`/Users/farokh/Desktop/piltonet-dev/development/venom/development/venom-front/src/contracts/${contractBase}/${contractName}.json`, jsonData);
    // await fs.copyFileSync(
    //   `./contracts/LendingCircle/${contractName}.tsol`,
    //   `/Users/farokh/Desktop/piltonet-dev/development/venom/development/venom-front/src/contracts/${contractBase}/${contractName}.tsol`
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

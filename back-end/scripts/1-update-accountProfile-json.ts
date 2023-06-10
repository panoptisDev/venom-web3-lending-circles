var fs = require('fs');

async function create() {
  try {
    const contractName = "AccountProfileContract";
    const contrat = await locklift.factory.getContractArtifacts(contractName);
    const OBJ = {
      abi: contrat.abi,
      tvc: contrat.tvc,
      code: contrat.code
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

create()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
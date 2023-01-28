const hre = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  console.log('Account balance:', (await deployer.getBalance()).toString());

  const KickStarter = await hre.ethers.getContractFactory('kickstarter');
  const kickstarter = await KickStarter.deploy();

  await kickstarter.deployed();

  console.log('kickstarter deployed to ', kickstarter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

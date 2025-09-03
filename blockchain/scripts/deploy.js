// File: blockchain/scripts/deploy.js

const hre = require("hardhat");

async function main() {
  console.log("Deploying Library contract...");

  // This line tells Hardhat to find our 'Library' contract and prepare it for deployment.
  const library = await hre.ethers.deployContract("Library");

  // This line waits for the transaction to be confirmed on the blockchain.
  await library.waitForDeployment();

  // We print the public address of our deployed contract to the console.
  console.log(`Library contract deployed successfully to address: ${library.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
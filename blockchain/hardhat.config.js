require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    bscTestnet: {
      url: process.env.ALCHEMY_API_KEY_URL || "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.WALLET_PRIVATE_KEY]
    }
  }
};
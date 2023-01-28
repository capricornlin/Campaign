require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: '0.8.17',
  networks: {
    // hardhat: {
    //   chainId: 1337,
    // },
    goerli: {
      url: 'https://goerli.infura.io/v3/4a336c45a610447ebcc52981cd8e43c3',
      accounts: [`0x` + GOERLI_PRIVATE_KEY],
    },
  },
};

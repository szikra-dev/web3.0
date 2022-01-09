// https://eth-ropsten.alchemyapi.io/v2/KB4HH9twoiRhw6GHCK2vqimGA_qpcfHW

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/KB4HH9twoiRhw6GHCK2vqimGA_qpcfHW',
      accounts: [
        '246f973c87026b442b0ef295c526c96ad89d80b6c1cb48d25d7e2387a9532bac',
      ],
    },
  },
}

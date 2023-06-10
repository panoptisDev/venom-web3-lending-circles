const { ethers } = require('ethers')
const constants = require('./constants')
const SDK = require('./v1')

const NETWORKS = constants.NETWORKS

function getProvider (chainId) {
    const network = NETWORKS.find(n => (n.chainId === '0x' + chainId.toString(16)))
    return new ethers.providers.JsonRpcProvider(network.rpcUrls[0])
}

module.exports = {
    constants,
    SDK,
    getProvider
}

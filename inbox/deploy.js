require('dotenv').config();


const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const {abi, evm} = require('./compile');

const INITIAL_MESSAGE = 'Initial Message';
const MNEMONIC = process.env.MNEMONIC;
const INFURA_URL = process.env.INFURA_URL;

const provider = new HDWalletProvider(
    MNEMONIC,
    INFURA_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const deploymentAccount = accounts[0]

    console.log("Attempting to deploy from account", deploymentAccount);

    const inbox = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: [INITIAL_MESSAGE] })
        .send({ from: deploymentAccount, gas: 1000000 });

    console.log("Contract deployed to:", inbox.options.address); //0xEf3141CA6C53142DbAD1bbF4DF61b21cb46d0472
    provider.engine.stop();
};

deploy();



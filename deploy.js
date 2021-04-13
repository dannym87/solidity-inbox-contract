const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider({
    mnemonic: process.env.WALLET_MNEMONIC,
    providerOrUrl: process.env.PROVIDER_URL,
});

const web3 = new Web3(provider);

const deploy  = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Deploying from account", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ["Hello world!"] })
        .send({ from: accounts[0], gas: 1500000 });

    console.log("Contract deployed to", result.options.address);
};
deploy();
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require("../../compile.js");

let accounts;
let inboxContract;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inboxContract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ["foo"] })
        .send({ from: accounts[0], gas: 1500000 });

    inboxContract.setProvider(provider);
});

describe("Inbox", () => {
    it("Can create a contract", () => {
        assert.ok(inboxContract.options.address);
    });

    it("Has a default message", async () => {
        assert.strictEqual(await inboxContract.methods.message().call(), "foo");
    });

    it("Can set a new message", async () => {
        const newMessage = "new message";
        await inboxContract.methods.setMessage(newMessage).send({
            from: accounts[0],
            gas: 1500000,
        });

        assert.strictEqual(await inboxContract.methods.message().call(), newMessage);
    });
});
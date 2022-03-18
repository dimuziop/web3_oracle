
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {abi, evm} = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;
const INITIAL_MESSAGE = 'Initial Message';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: [INITIAL_MESSAGE] })
    .send({ from: accounts[0], gas: 1000000 });
});


describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message ', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE)
  });

  it('should update the message', async () => {

    const newMessage = "New Message";

    const message = await inbox.methods.message().call();
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0], gas: 1000000 });
    const updatedMessage = await inbox.methods.message().call();

    assert.notEqual(message, updatedMessage)
    assert.equal(updatedMessage, newMessage)

  })
});

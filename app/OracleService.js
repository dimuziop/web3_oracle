const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const fetch = require('node-fetch')

const contractJson = require('../build/contracts/Oracle.json')

const web3 = new Web3('ws://127.0.0.1:7545')

const contractAddress = '0x171bB9282B77C2203174EF4c69e5Ed281eE26737'
const contractInstance = new web3.eth.Contract(contractJson.abi, contractAddress)
const privateKey = Buffer.from('f1ae5a0f2f4658865a11ad4d60f968458f1c46c9ab450565b85a3da4a6458393', 'hex')
const address = '0x68D30a7718CB64657800fbfA98b0ca725cC414e4'

web3.eth.getBlockNumber().then(n => listenEvent(n - 1))

function listenEvent(lastBlock) {
  contractInstance.events.__callbackNewData({}, { fromBlock: lastBlock }, (err, event) => {
    event ? updateData() : null
    err ? console.log(err) : null
  })
}

function updateData() {
  const url = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY"


  fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log("Getting Data: Element Count -> " + json.element_count)
      setDataContract(json.element_count)
    }
    )
}

function setDataContract(meteorites) {
  web3.eth.getTransactionCount(address, (err, txNum) => {
    contractInstance.methods.setAsteroidsCount(meteorites).estimateGas({}, (err, gasAmount) => {
      let rawTx = {
        nonce: web3.utils.toHex(txNum),
        gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
        gasLimit: web3.utils.toHex(gasAmount),
        to: contractAddress,
        value: "0x00",
        data: contractInstance.methods.setAsteroidsCount(meteorites).encodeABI()
      }

      const tx = new Tx(rawTx)
      tx.sign(privateKey)
      const serializedTx = tx.serialize().toString('hex')
      web3.eth.sendSignedTransaction('0x' + serializedTx)

    })
  })
}

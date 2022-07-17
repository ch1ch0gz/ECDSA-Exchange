//import * as secp from "@noble/secp256k1";

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
var secp = require('@noble/secp256k1')

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

//address 1
let privateKey1 = secp.utils.randomPrivateKey();
privateKey1Hex = Buffer.from(privateKey1).toString('hex');
let publicKey1 = secp.getPublicKey(privateKey1Hex);
let publicKey1Hex = Buffer.from(publicKey1).toString('hex');
publicKey1Hex = "0x" + publicKey1Hex.slice(publicKey1Hex.length - 40);

//address 2
let privateKey2 = secp.utils.randomPrivateKey();
privateKey2Hex = Buffer.from(privateKey2).toString('hex');
let publicKey2 = secp.getPublicKey(privateKey2Hex);
let publicKey2Hex = Buffer.from(publicKey2).toString('hex');
publicKey2Hex = "0x" + publicKey2Hex.slice(publicKey2Hex.length - 40);

//address 3
let privateKey3 = secp.utils.randomPrivateKey();
privateKey3Hex = Buffer.from(privateKey3).toString('hex');
let publicKey3 = secp.getPublicKey(privateKey3Hex);
let publicKey3Hex = Buffer.from(publicKey3).toString('hex');
publicKey3Hex = "0x" + publicKey3Hex.slice(publicKey3Hex.length - 40);

const address = new Map([
  [publicKey1Hex, [privateKey1,publicKey1,privateKey1Hex]],
  [publicKey2Hex, [privateKey2,publicKey2, privateKey2Hex]],
  [publicKey2Hex, [privateKey3,publicKey3, privateKey3Hex]]
])


const balances = {
  [publicKey1Hex]: 100,
  [publicKey2Hex]: 50,
  [publicKey3Hex]: 75,
}

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', async (req, res) => {
  const { sender, recipient, privateKey, amount } = req.body;
  //Sign and check message is real
  const messageHash = await secp.utils.sha256(sender + amount);
  const signature = await secp.sign(messageHash, address.get(sender)[0]);
  const isValid = secp.verify(signature, messageHash, address.get(sender)[1]);

  if (isValid && (privateKey === address.get(sender)[2])) {
    balances[sender] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[sender] });
  }
  else {
    console.log(`Cannot verify transaction`);
 }
 });



app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(`Available Accounts`)
  console.log(`(0) ${publicKey1Hex}`)
  console.log(`(1) ${publicKey2Hex}`)
  console.log(`(2) ${publicKey3Hex}`)
  console.log(``)
  console.log(`Private Keys`)
  console.log(`(0) ${privateKey1Hex}`)
  console.log(`(1) ${privateKey2Hex}`)
  console.log(`(2) ${privateKey3Hex}`)
});

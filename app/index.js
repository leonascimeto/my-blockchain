const express = require('express');
const Blockchain = require('../blockchain');
const PORT = process.env.HTTP_PORT || 3000;
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const app = express();
app.use(express.json());

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pServer = new P2pServer(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);

app.get('/blocks', (req, res) => {
   res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
   const block = blockchain.addBlock(req.body.data);
   console.log(`New block added: ${block.toString()}`);

   p2pServer.syncChains();

   res.json(blockchain.chain);
});

app.get('/mine-transactions', (req, res) => {
   const block = miner.mine();
   console.log(`New block added: ${block.toString()}`);
   res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
   return res.json(transactionPool.transactions);
});

app.post('/transact', (req, res) => {
   const { recipient, amount } = req.body;
   const transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);
   p2pServer.broadcastTransaction(transaction);
   res.redirect('/transactions');
});

app.get('/public-key', (req, res) => {
   res.json({publicKey: wallet.publicKey});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
p2pServer.listen();
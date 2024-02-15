const express = require('express');
const Blockchain = require('../blockchain');
const PORT = process.env.HTTP_PORT || 3000;
const P2pServer = require('./p2p-server');

const app = express();
app.use(express.json());

const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.get('/blocks', (req, res) => {
   res.json(bc.chain);
});

app.post('/mine', (req, res) => {
   const block = bc.addBlock(req.body.data);
   console.log(`New block added: ${block.toString()}`);
   res.json(bc.chain);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
p2pServer.listen();
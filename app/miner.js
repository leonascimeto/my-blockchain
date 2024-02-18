const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");

class Miner {
   constructor(blockchain, transactionPool, wallet, ps2Server){
      this.blockchain = blockchain;
      this.transactionPool = transactionPool;
      this.wallet = wallet;
      this.p2pServer = ps2Server;
   }

   mine(){
      const validTransactions = this.transactionPool.validTransactions();
      validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet()));
      const block = this.blockchain.addBlock(validTransactions);
      this.p2pServer.syncChains();
      this.transactionPool.clear();
      this.p2pServer.broadcastClearTransaction();
      return block;
   }
}

module.exports = Miner;
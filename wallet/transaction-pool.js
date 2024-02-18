const Transaction = require("./transaction");

class TransactionPool {
   constructor(){
      this.transactions = [];
   }

   upsertTransaction(transaction){
      let transactionIndex = this.transactions.findIndex(t => t.id === transaction.id);
      transactionIndex >= 0 ? 
         this.transactions[transactionIndex] = transaction :
         this.transactions.push(transaction); 
   }

   existingTransaction(address){
      return this.transactions.find(t => t.input.address === address);
   }

   validTransactions(){
      return this.transactions.filter(transaction => {
         const outputTotal = transaction.outputs.reduce((acc, output) => {
            return acc + output.amount;
         }, 0);

         if(transaction.input.amount !== outputTotal){
            console.log(`Invalid transaction from ${transaction.input.address}`);
            return;
         }

         if(!Transaction.verifyTransaction(transaction)){
            console.log(`Invalid signature from ${transaction.input.address}`);
            return;
         }

         return transaction;
      });
   }

   clear(){
      this.transactions = [];
   }
}

module.exports = TransactionPool;
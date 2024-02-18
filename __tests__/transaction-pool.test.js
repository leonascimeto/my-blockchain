const TransactionPool = require('../wallet/transaction-pool')
const Wallet = require('../wallet')
const Blockchain = require('../blockchain')

describe('Transaction Pool', () => {
   let transaction, transactionPool, wallet, recipient, amount, blockchain;

   beforeEach(() => {
      transactionPool = new TransactionPool();
      wallet = new Wallet();
      blockchain = new Blockchain();
      recipient = 'r4d0m-adr355';
      amount = 30;
      transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);
   });

   it('adds a transaction to the pool', () => {
      expect(transactionPool.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
   });

   it('updates a transaction in teh pool', () => {
      const oldTransaction = JSON.stringify(transaction);
      const newTransaction = transaction.update(wallet, 'n3xt-r3cipi3nt', 50);

      transactionPool.upsertTransaction(newTransaction);

      expect(JSON.stringify(transactionPool.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
   });

   it('clear transactions', () => {
      transactionPool.clear();
      expect(transactionPool.transactions).toEqual([]);
   });   

   describe('valid and corrupt transaction', () => {
      let validTransactions;
      beforeEach(() => {
         validTransactions = [...transactionPool.transactions];
         for(let i=0; i<6; i++){
            wallet =  new Wallet();
            transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);
            
            i%2 == 0 ? transaction.input.amount = 5000000000 : validTransactions.push(transaction); 
         }
      });

      it('shows a diference and between valid and corrupt transactiosn', () => {
         expect(JSON.stringify(transactionPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
      });

      it('grabs valid transactions', () => {
         expect(transactionPool.validTransactions()).toEqual(validTransactions);
      });

   });
});
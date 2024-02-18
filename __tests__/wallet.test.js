const TransactionPool = require('../wallet/transaction-pool')
const Wallet = require('../wallet')
const Blockchain = require('../blockchain')
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
   let wallet, transactionPool, transaction, sendAmount, recipient, blockchain;

   beforeEach(() => {
      transactionPool = new TransactionPool();
      wallet = new Wallet();
      blockchain = new Blockchain();

      sendAmount = 50;
      recipient = 'r4nd0m-adr355';
      transaction = wallet.createTransaction(recipient, sendAmount, blockchain, transactionPool);
      transaction = wallet.createTransaction(recipient, sendAmount, blockchain, transactionPool);
   });

   it('doubles the `sendAmount` substracted from the wallet balance', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
   });

   it('clones the `sendAmount` output for the recipient', () => {
      expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
   });

   describe("calculating a balance", () => {
      let addBalance, repeatAdd, senderWallet, recepientWallet;

      beforeEach(() => {
         senderWallet = new Wallet();
         recepientWallet = new Wallet();
         addBalance = 100;
         repeatAdd = 3;
         for(let i=0; i<repeatAdd; i++){
            senderWallet.createTransaction(recepientWallet.publicKey, addBalance, blockchain, transactionPool);
         }
         blockchain.addBlock(transactionPool.transactions);
      });

      it('calculates the balance for blockchain transactions matching the recipient', () => {
         expect(recepientWallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
      });

      it('calculates the balance for blockchain transactions matching the sender', () => {
         expect(senderWallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
      });

      describe('and the recipient conducts a transaction', () => {
         let substractBalance, recipientBalance;

         beforeEach(() => {
            transactionPool.clear();
            substractBalance = 60;
            recipientBalance = wallet.calculateBalance(blockchain);
            wallet.createTransaction(senderWallet.publicKey, substractBalance, blockchain, transactionPool);
            blockchain.addBlock(transactionPool.transactions);
         });

         describe('and the sender sends another transaction to the recipient', () => {
            beforeEach(() => {
               transactionPool.clear();
               senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, transactionPool);
               blockchain.addBlock(transactionPool.transactions);
            });

            it('calculate the recipient balance only using transactions since its most recent one', () => {
               expect(wallet.calculateBalance(blockchain)).toEqual(recipientBalance - substractBalance + addBalance);
            });
         });
      });
   });
});
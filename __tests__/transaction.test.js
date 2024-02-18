const Transaction = require('../wallet/transaction')
const Wallet = require('../wallet')
const {MINING_REWARD} = require('../config');

describe('Transaction', () => {
  let transaction, transactionInvalid, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    recipient = '0x123456';
    amount = 50;
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it('output the `amount` subtracted from the wallet balance', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });

  it('output the `amount` added to the recipient', () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
      .toEqual(amount);
  });

  it('input the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('input public key matches the wallet publicKey', () => {
    expect(transaction.input.address).toEqual(wallet.publicKey);
  });

  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 500000000000000000000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  it('should update a transaction', () => {
    let nextAmount = 20;
    let nextRecipient = '0x54321';
    transaction = transaction.update(wallet, nextRecipient, nextAmount);
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount - nextAmount);
    expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
      .toEqual(nextAmount);
  });
  

  it('does not create transaction if amount exceeds balance', () => {
    transactionInvalid = Transaction.newTransaction(wallet, recipient, 500000000000000000000);
    expect(transactionInvalid).toEqual(undefined);
  });

  describe('creating a reward transaction', () => {
    beforeEach(() => {
       transaction = Transaction.rewardTransaction(wallet, Wallet.blockChainWallet());
    });

    it('reward the miners wallet', () => {
       expect(transaction.outputs.find(ot => ot.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
    });
 });
});
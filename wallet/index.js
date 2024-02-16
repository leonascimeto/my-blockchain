const { INITIAL_BALANCE } = require('../config');
const ChainUtil = require('../chain-util');

class wallet {
   constructor () {
      this.balance = INITIAL_BALANCE;
      this.keyPair = ChainUtil.genKeyPair();
      this.publicKey = this.keyPair.getPublic().encode('hex');
   }

   toString() {
      return `Wallet -
         publicKey: ${this.publicKey.toString()}
         balance  : ${this.balance}`
   }
}

module.exports = wallet;
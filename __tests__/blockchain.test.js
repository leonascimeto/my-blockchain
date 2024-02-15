const Blockchain = require('../blockchain');
const Block = require('../blockchain/block');

describe('Blockchain', () => {
   let blockchain;
   let bc2;

   beforeEach(() => {
      blockchain = new Blockchain();
      bc2 = new Blockchain();
   });

   it('starts with genesis block', () => {
      expect(blockchain.chain[0]).toEqual(Block.genesis());
   });

   it('should add a new block', () => {
      const data = 'foo';
      blockchain.addBlock(data);
      expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
   });

   it("validates a valid chain", () => {
      bc2.addBlock('$500');
      expect(bc2.isValidChain(bc2.chain)).toBe(true);
   });

   it("invalidates a chain with a corrupt genesis block", () => {
      bc2.chain[0].data = '$0';
      expect(bc2.isValidChain(bc2.chain)).toBe(false);
   });

   it("invalidates a corrupt chain", () => {
      bc2.addBlock('$500');
      bc2.chain[1].data = '$100';
      expect(bc2.isValidChain(bc2.chain)).toBe(false);
   });

   it("replaces the chain with a valid chain", () => {
      bc2.addBlock('$500');
      blockchain.replaceChain(bc2.chain);
      expect(blockchain.chain).toEqual(bc2.chain);
   });

   it("does not replace the chain with one of equal or lesser length", () => {
      blockchain.addBlock('$500');
      blockchain.replaceChain(bc2.chain);
      expect(blockchain.chain).not.toEqual(bc2.chain);
      bc2.addBlock('$1000');
      blockchain.replaceChain(bc2.chain);
      expect(blockchain.chain).not.toEqual(bc2.chain);
   });
});
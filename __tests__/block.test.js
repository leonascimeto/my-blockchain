const Block = require('../blockchain/block');
const { DIFFICULTY } = require('../config');

describe('Block', () => {
   let data;
   let lastBlock;
   let block;
   beforeEach(() => {
      data = 'block data';
      lastBlock = Block.genesis();
      block = Block.mineBlock(lastBlock, data);
   });
   
   it('sets the `data` to match the input', () => {
      expect(block.data).toEqual(data);
   });

   it('sets the `lastHash` to match the hash of the last block', () => {
      expect(block.lastHash).toEqual(lastBlock.hash);
   });

   it('generates a hash that matches the difficulty', () => {
      expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
   });

   it('lowers the difficulty for slowly mined blocks', () => {
      expect(Block.adjustDifficulty(block, block.timestamp + 36000000)).toEqual(block.difficulty - 1);
   });

   it('raises the difficulty for quickly mined blocks', () => {
      expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
   });
});
const Block = require('./block');

const block = new Block('7657', '4587SFDS85', '8745DSFDS', '100');

console.log(block.toString());
console.log(Block.genesis().toString());
const primeiroBloco = Block.mineBlock(Block.genesis(), '$100');
console.log(primeiroBloco.toString());

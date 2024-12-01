import web3 from './web3';
import Lottery from './build/contracts/Lottery.json';

const contractAddress = "0x80A85018ac486650Ffd5513b1800b7b541Eb3E95"; // Replace with the deployed contract address
const lottery = new web3.eth.Contract(Lottery.abi, contractAddress);

export default lottery;
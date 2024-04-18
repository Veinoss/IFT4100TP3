// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Lottery {
    
    uint256 private constant JACKPOT_CHANCE = 10;

    uint256 private prizePool;
    uint256 private jackPot;
    mapping(address => string) player;
    address[] public players;

    event ANewPlayerEnrolled(string message);

    constructor(){   
    }
    
    function getPricePool() public view returns (uint) {
        return prizePool;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getJackPot() public view returns (uint) {
        return jackPot;
    }

    function enroleInLottery(string memory playerName) public payable {
       require(msg.value == 1 ether);
       require(bytes(playerName).length > 0);
        
        player[msg.sender] = playerName;
        players.push(msg.sender);

        // On garde 10% pour un jackpot potentiel 1 chance sur 10 de frappé le bonus
        prizePool += (msg.value * 90) / 100; 
        jackPot += (msg.value * 9) / 100;       

        emit ANewPlayerEnrolled(string(abi.encodePacked(player[msg.sender], " has enrolled!!! Good luck!")));
    }

    function getParticipants() public view returns(address[] memory){
        return players;
    }

    function getAWinner() public returns(string memory){
        require(players.length == 10, "We do not have 10 participants yet");
        uint nbOfPlayers = players.length;
        uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        uint winnerIndex = randomHash % nbOfPlayers;

        address winner = players[winnerIndex];

        sendPrize(winner);
        
        return player[winner];
    }

    function getPrizePool() private view returns (uint256){
        uint256 effectivePrize;        
        uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        bool isJackpot = (randomHash % 100) < JACKPOT_CHANCE;

        if(isJackpot){
            effectivePrize = prizePool + jackPot;
        }

        return effectivePrize;
    }
    function sendPrize(address winner) private {
        uint prize = prizePool;
        prizePool = 0;
        payable(winner).transfer(prize);
    }
}
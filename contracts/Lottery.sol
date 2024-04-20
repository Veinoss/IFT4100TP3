// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;



contract Lottery {
    address public owner;
    uint256 private jackPotOdds = 10;

    uint256 private prizePool;
    uint256 private jackPot;
    mapping(address => string) player;
    address[] public players;

    event ANewPlayerEnrolled(string message);    
    event DisplayWinner(string message);
    event JackPotIsWon(string message);

    constructor(){   
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Fonction reserver au owner");
        _;
    }
    
    function setJackPotOdds(uint256 newOdds) public onlyOwner {   
        require(newOdds >= 0 && newOdds <= 100);     
        jackPotOdds = newOdds;
    }
    
    function getJackPot() public view returns (uint) {
        return jackPot;
    }

    function getPrizePool() public view returns (uint) {
        return prizePool;
    }

    function getMaximumPrizePool() public view returns (uint256) {
        return prizePool + jackPot;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    

    function enroleInLottery(string memory playerName) public payable {
       require(msg.value == 1 ether);
       require(bytes(playerName).length > 0);
       require(players.length < 10);
        
        player[msg.sender] = playerName;
        players.push(msg.sender);

        // On garde 9% pour un jackpot potentiel 1 chance sur 10 de frappé le bonus
        prizePool += (msg.value * 90) / 100; 
        jackPot += (msg.value * 9) / 100;       

        emit ANewPlayerEnrolled(string(abi.encodePacked(player[msg.sender], " has enrolled!!! Good luck!")));

        if(players.length == 10){
            getAWinner();
        }
    }

    function getParticipants() public view returns(address[] memory){
        return players;
    }

    function getNumberOfParticipants() public view returns(uint){
        return players.length;
    }

    function getAWinner() private {        
        
        require(players.length == 10, "We do not have 10 participants yet ");
        uint nbOfPlayers = players.length;
        uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        uint winnerIndex = randomHash % nbOfPlayers;

        address winner = players[winnerIndex];   

        sendPrize(winner);        

        emit DisplayWinner(player[winner]);
        
        resetState();
    }    

    function isJackPotWon() private view returns (bool){
        uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        return (randomHash % 100) <= jackPotOdds;
    }

    function sendPrize(address winner) private {

        if(isJackPotWon())
        {
            prizePool += jackPot;
            jackPot = 0;
            emit JackPotIsWon(string(abi.encodePacked("Congratulation to: ", player[winner], " you won the JACKPOT!!!!!")));
        }
       
        payable(winner).transfer(prizePool);
    }

    function resetState() private {
        prizePool = 0;
        delete players;
    }
}
const Lottery = artifacts.require("Lottery");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Lottery", function ( accounts ) {
  
  let lottery;

  beforeEach(async () =>{
    lottery = await Lottery.new();
  });

  async function enroleNinePlayers(lottery){
    const wager = web3.utils.toWei('1', 'ether');

    let playerNames = ["player0", "player1", "player2", "player3", "player4", "player5", 
                      "player6", "player7", "player8", "player9"];

    for(let i = 0; i < 9; i++) {
      await lottery.enroleInLottery(playerNames[i], {from: accounts[i], value: wager});  
    }  
  }

  it("should assert true", async function () {
    await Lottery.deployed();
    return assert.isTrue(true);
  });
 
  it("should allow multiple accounts to enroll", async () => {   
    const wager = web3.utils.toWei('1', 'ether');
    const expectedPricePool = web3.utils.toWei('8.1', 'ether');
    const expectedJackPot = web3.utils.toWei('0.81', 'ether');

    await enroleNinePlayers(lottery);

    const playersCount = await lottery.getParticipants();
    const pricePool = await lottery.getPrizePool();
    const jackPot = await lottery.getJackPot();

    assert.equal(playersCount.length, 9, "There should be exactly 9 players");
    assert.equal(expectedPricePool, pricePool, "The pricePool should be 8.1");
    assert.equal(expectedJackPot, jackPot, "The jackpot should be 0.81");   
  });

  it("should emit message when enrolling", async () => {  
    const wager = web3.utils.toWei('1', 'ether');
    const ginette = "Ginette Reno";
    const joel = "Joel Legendre";
    
    const tx1 =  await lottery.enroleInLottery(ginette, {from: accounts[0], value: wager});      
    const tx2 =  await lottery.enroleInLottery(joel, {from: accounts[0], value: wager});      

    const resultGinette = tx1.logs[0].args.message; 
    const resultJoel = tx2.logs[0].args.message; 
    assert.isTrue(resultGinette.includes(ginette), "The event output should contain the player's name");  
    assert.isTrue(resultJoel.includes(joel), "The event output should contain the player's name");   
  });

  it("should have 9 players enrolled", async () => {   
    let expectedPlayers = 9;   

    await enroleNinePlayers(lottery);

    let nbOfPlayers = await lottery.getNumberOfParticipants()    
    
    assert.equal(expectedPlayers, nbOfPlayers);     
  });

  it("with jackpotOdds at 100%, should return prizePool + jackpot", async () => {    
    const expectedPrize = web3.utils.toWei('8.91', 'ether');   
    await lottery.setJackPotOdds(100);

    await enroleNinePlayers(lottery);    

    prize = await lottery.getMaximumPrizePool();    

    assert.equal(expectedPrize, prize);   
  });

  it("picks a winner, and sends him money", async () => {    
    let possibleWinners = ["player0", "player1", "player2", "player3", "player4", "player5", 
                      "player6", "player7", "player8", "player9"];

    const wager = web3.utils.toWei('1', 'ether');
    
    const test = enroleNinePlayers(lottery);    
    const tx1 = await lottery.enroleInLottery(possibleWinners[9], {from: accounts[9], value: wager});  
       
    const winner = tx1.logs[0].args.message;

    assert.isTrue (possibleWinners.some(substring => winner.includes(substring)));
    assert.equal(tx1.logs.length, 1, "no event was sent");
  });

});

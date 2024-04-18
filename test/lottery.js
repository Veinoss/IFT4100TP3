const Lottery = artifacts.require("Lottery");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Lottery", function ( accounts ) {
  let playerNames = ["player0", "player1", "player2", "player3", "player4", "player5", 
                      "player6", "player7", "player8", "player8", "player9"];
  

  it("should assert true", async function () {
    await Lottery.deployed();
    return assert.isTrue(true);
  });
 
  it("should allow multiple accounts to enroll", async () => {
    const lottery = await Lottery.deployed();
    const wager = web3.utils.toWei('1', 'ether');
    const expectedPricePool = web3.utils.toWei('9', 'ether');
    const expectedJackPot = web3.utils.toWei('0.9', 'ether');

    for(let i = 0; i < 10; i++) {
      await lottery.enroleInLottery(playerNames[i], {from: accounts[i], value: wager});  
    }  

  const playersCount = await lottery.getParticipants();
  const pricePool = await lottery.getPricePool();
  const jackPot = await lottery.getJackPot();

  assert.equal(playersCount.length, 10, "There should be exactly 10 players");
  assert.equal(expectedPricePool, pricePool, "The pricePool should be 9");
  assert.equal(expectedJackPot, jackPot, "The jackpot should be 0.9");
   
  });

  it("should emit message when enrolling", async () => {
    const lottery = await Lottery.deployed();
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
//})
});

const Lottery = artifacts.require("Lottery");
const fs = require('fs');
const path = require('path');


module.exports = function(deployer) {
    deployer.then(async () => {
      console.log("Deploying Lottery contract");
      await deployer.deploy(Lottery);
      const contractAddress = Lottery.address
      const envContent = `REACT_APP_LOTTERY_ADDRESS=${contractAddress}\n`;
      
      // Resolve the path to the root directory
    const envFilePath = path.resolve(__dirname, '../.env'); 

    fs.writeFileSync(envFilePath, envContent);
    console.log("Lottery deployed at:", contractAddress);
    console.log(".env file created at:", envFilePath);

    }).catch(error => {
      console.error("Error in deployment:", error);
    });
  }
import Web3 from 'web3';

// Define the Ganache URL (the default port is 8545)
const ganacheURL = "http://127.0.0.1:8545"; // Replace with your Ganache host/port if different
let web3;

/*if (window.ethereum) {
  // Use MetaMask's provider if available
  web3 = new Web3(window.ethereum);
  try {
    window.ethereum.enable(); // Request account access
  } catch (error) {
    console.error("User denied account access", error);
  }
} else {*/
  // Fallback to using Ganache's local provider
  try{
  web3 = new Web3(new Web3.providers.HttpProvider(ganacheURL));
  console.log("Connected to Ganache at:", ganacheURL);
  } catch (error){
    console.error("did NOT connect to ganache:", error)
  }
//}

export default web3;
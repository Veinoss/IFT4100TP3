import React, { useState, useEffect } from "react";
import web3 from "./web3";
import lottery from "./Lottery.json";
import "./App.css";

const App = () => {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const contractAddress = process.env.REACT_APP_LOTTERY_ADDRESS;

  const contract = new web3.eth.Contract(lottery.abi, contractAddress);

  useEffect(() => {
    const fetchParticipants = async () => {
      const fetchedParticipants = await contract.methods.getParticipants().call();
      setParticipants(fetchedParticipants);
    };
    fetchParticipants();
  }, [contract]);

  const handleEnroll = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setMessage("Please enter a valid name.");
      return;
    }

    try {
      setMessage("Processing your transaction...");
      const accounts = await web3.eth.getAccounts();

      // Set gas price for networks not supporting EIP-1559
      const gasPrice = await web3.eth.getGasPrice();

      // Send transaction to enroll in the lottery
      await contract.methods.enroleInLottery(name).send({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether"),
        gas: 3000000, // Set an appropriate gas limit
        gasPrice, // Use legacy gas price
      });

      // Fetch updated participants
      const updatedParticipants = await contract.methods.getParticipants().call();
      setParticipants(updatedParticipants);

      setMessage("🎉 Successfully enrolled in the lottery!");
      setName(""); // Clear the input
    } catch (error) {
      console.error("Error enrolling in lottery:", error);
      setMessage("❌ Failed to enroll. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Welcome to the Lottery 🎉</h1>
      <p>{message}</p>
      <form onSubmit={handleEnroll}>
        <label>
          Enter your name to join:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Enroll</button>
      </form>
      <div className="pyramid">
        {participants.map((participant, index) => (
          <div className="bubble" key={index}>
            {participant}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

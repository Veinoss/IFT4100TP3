import React, {Component} from "react";
import './App.css'
import web3 from './web3';
import lottery from './Lottery.json'

class App extends Component {

    constructor(props){
      super(props)
      this.state = {
        accounts: [],       
        balanceInEther: [],
        owner:"",
        players: "",
        value:"",
        selectedAccount: 0,
        jackpot: ""
      }
    }



    async componentDidMount() {      
      const accounts = await web3.eth.getAccounts();
      console.log("Account retrieved:" + accounts)

      const balances = await this.updateBalances(accounts);

      const contractAddress = process.env.REACT_APP_LOTTERY_ADDRESS;
      console.log("Contract Address: ", contractAddress)
    
      const contractInstance = new web3.eth.Contract(lottery.abi, contractAddress);            
      console.log("contractInstance: ", contractInstance);

      const nbOfPlayers = await contractInstance.methods.getNumberOfParticipants().call();
      console.log("Number of players: ", nbOfPlayers)

      const owner = await contractInstance.methods.owner().call();
      console.log("Owner: ", owner)

      this.setState({
        accounts: accounts,        
        balanceInEther: balances,
        owner: owner,
        players: nbOfPlayers
      });
    }
  
    handleChange = (event) => {
      this.setState({ [event.target.name]: event.target.value });
    };
  
    handleSubmit = async (event) => {
      event.preventDefault();

      console.log("Entering handleSubmit...")      
      const contractAddress = process.env.REACT_APP_LOTTERY_ADDRESS;
      const contractInstance = new web3.eth.Contract(lottery.abi, contractAddress);
      const numberP = await contractInstance.methods.getNumberOfParticipants().call();
      console.log("In handleSubmit- number of players: ", numberP)

      const account = await web3.eth.getAccounts();

      try {
        await contractInstance.methods.enroleInLottery(this.state.name).send({ 
          from: account[0],
          value: web3.utils.toWei("1", 'ether'),
          gas: 3000000, // Set a reasonable gas limit explicitly
          gasPrice: web3.utils.toWei('20', 'gwei'), // Use a fixed legacy gas price
        });

         // Fetching updated contract state
        const players = parseInt( await contractInstance.methods.getNumberOfParticipants().call());
        const newJackpotSize = web3.utils.fromWei(await contractInstance.methods.getJackPot().call(), 'ether');
        console.log("Jackpot size = : ", newJackpotSize)

        console.log('Transaction successful');
        this.setState({ 
          players: players,
          balanceInEther: await this.updateBalances(this.state.accounts),
          name: "",
          succesMsg: "Merci! Transaction est un succès 🎉!",
          jackpot: newJackpotSize
        });

        console.log("nbOfPlayers from setState = : ", this.state.players)
        console.log("Jackpot size from setState = : ", this.state.jackpot)

      } catch (error) {
        console.error('Error calling enroleInLottery function:', error);
      }
    };

    render() {
      return (
        <div className='text-center' style={{ color: "" }}>
          <h1> Hello! ✌️ Lottery!</h1>
          <h2>Présentement, le nombre de participants est de : {this.state.players}</h2>
          <br></br>
          <br></br>
          <h2>Le jackpot est rendu au montant de: {this.state.jackpot}</h2>
          <br></br>
          <br></br>
          <p>Ton adresse de portefeuille : {this.state.account}</p>
          <p>Balance des 10 accounts : </p>
            <ul>
            {this.state.balanceInEther.length > 0 ? (
              this.state.balanceInEther.map((bal, index) => (
                <li key={index}>
                  Compte {index + 1}: {bal} ETH
                </li>
              ))) : <li>Erreur: balance indisponible...</li>}
            </ul>          
          <br></br>
          <br></br>
          <p>Si tu veux participer, entre ton nom et tu seras automatiquement ajouté! Mise est de 1 ether!</p>
          <br></br>
          <form>          
            <label>Choisissez un compte de (0-9) pour déduire la mise:
              <input type="text" />
            </label>
          </form>
          <br></br>
          <form onSubmit={this.handleSubmit}>
            <label>
              Nom du participant:
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </label>
            <button type="submit">Participer</button>
            <br></br>
            {this.state.succesMsg}
          </form>
        </div>
      )
    }

    async updateBalances(accounts) {
      const balances = []     
  
      for (let i = 0; i<10; i++){
        let wei = await web3.eth.getBalance(accounts[i])
        balances.push(await web3.utils.fromWei(wei, "ether"));
      }
  
      return balances
    }
  }
  


  export default App;
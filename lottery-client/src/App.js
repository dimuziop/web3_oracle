import './App.css';
import web3 from "./web3";
import lottery from "./lottery";
import {Component} from "react";

class App extends Component {

    state = {manager: "", players: [], balance: '', value: '', message: "", isManager: false}

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({manager})
        this.setState({players})
        this.setState({balance})
        await this.isManager();
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();

        this.setState({message: "Waiting on transaction success..."})

        const tx = await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        })

        this.setState({message: "You have been entered, TX: " + tx.transactionHash })
    }

    onClick = async (event) => {
        const accounts = await web3.eth.getAccounts();

        this.setState({message: "Waiting on transaction success..."})

        const tx = await lottery.methods.pickWinner().send({
            from: accounts[0],
        })

        this.setState({message: "A winner have been picked, TX: " + tx.transactionHash })
    }

    isManager = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({manager: this.state.manager === accounts[0]});
    }

    render() {
        return (
            <div className="App">
                <h2>Lottery Contract</h2>
                <p>
                    This contract is managed by {this.state.manager}.
                    There are currently {this.state.players.length} people in.
                    The total amount is {web3.utils.fromWei(this.state.balance, 'ether')} Ethers!
                </p>
                <hr/>
                <form onSubmit={this.onSubmit}>
                    <h4>Want to try your luck?</h4>
                    <div>
                        <label>Amount of ether to enter</label>
                        <input
                            value={this.state.value}
                            onChange={(event) => this.setState({ value: event.target.value })}
                        />
                    </div>
                    <button>Enter</button>
                </form>
                <hr/>
                <h4>Ready to pick a winner</h4>
                <button onClick={this.onClick}>Pick a winner</button>
                <hr />
                <h2>{this.state.message}</h2>
                <hr/>
            </div>
        );
    }
}

export default App;

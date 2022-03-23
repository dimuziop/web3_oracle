pragma solidity ^0.8.12;

// CONTRACT ADDRESS: 0x0f9218d7931bBa89Ba0E9Fa98B5BD2D905Ac6D7e [rinkeby]

contract Lottery {

    address public manager;
    address[] public players;

    constructor(){
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether, "At least .01 ether is required");
        players.push(msg.sender);
    }

    function pseudoRandom() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        uint index = pseudoRandom() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager, "Just owner executable");
        _;
    }

    function getPlayers() public view returns (address[] memory){
        return players;
    }
}

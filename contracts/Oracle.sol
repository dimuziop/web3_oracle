// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oracle {
    address owner;

    uint256 public asteroidsCount;

    event __callbackNewData();

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    function update() public onlyOwner {
        emit __callbackNewData();
    }

    function setAsteroidsCount(uint256 _num) public onlyOwner {
        asteroidsCount = _num;
    }
}

const assert = require("assert");
const Lottery = artifacts.require("Lottery");

contract("Lottery", async acc => {
    let lottery;

    beforeEach(async () => {
        lottery = await Lottery.deployed();
    });


    it("deploys a contract", async () => {
        assert.ok(lottery.address);
    })

    it("allows one account to enter", async () => {
        await lottery.enter({
            from: acc[0],
            value: web3.utils.toWei("0.02", "ether")
        })

        const players = await lottery.getPlayers({
            from: acc[0]
        })

        assert.equal(acc[0], players[0])
        assert.equal(1, players.length)

    })

    it("allows multiple account to enter", async () => {
        await lottery.enter({
            from: acc[0],
            value: web3.utils.toWei("0.02", "ether")
        })

        await lottery.enter({
            from: acc[1],
            value: web3.utils.toWei("0.02", "ether")
        })

        await lottery.enter({
            from: acc[2],
            value: web3.utils.toWei("0.02", "ether")
        })

        const players = await lottery.getPlayers({
            from: acc[0]
        })

        assert.equal(acc[0], players[0])
        assert.equal(acc[1], players[1])
        assert.equal(acc[2], players[2])
        assert.equal(3, players.length)

    })


})

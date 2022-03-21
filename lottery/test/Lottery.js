const assert = require("assert");
const Lottery = artifacts.require("Lottery");

contract("Lottery", async acc => {
    let lottery;

    beforeEach(async () => {
        lottery = await Lottery.new();
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


    it("requires a minimum amount of ether to enter", async () => {

        try {
            await lottery.enter({
                from: acc[1],
                value: web3.utils.toWei("0.01", "ether")
            })
            assert(false) // just to ensure
        } catch (e) {
            assert(e)
            assert.equal(e.reason, "At least .01 ether is required");
        }

    });


    it("requires to be a manager for pick a winner", async () => {

        try {
            await lottery.pickWinner({
                from: acc[1],
            })
            assert(false) // just to ensure
        } catch (e) {
            assert(e)
            assert.equal(e.reason, "Just owner executable");
        }

    });

    it("sends money to the winner and resets the players array", async () => {
        await lottery.enter({
            from: acc[0],
            value: web3.utils.toWei("2", "ether"),
        });

        const initialBalance = await web3.eth.getBalance(acc[0]);
        await lottery.pickWinner({ from: acc[0] });
        const finalBalance = await web3.eth.getBalance(acc[0]);
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei("1.8", "ether"));
    });


})

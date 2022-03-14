const MinterIMG = artifacts.require("MinterIMG");

contract('MinterImg', accounts => {

  const [owner, whitelistedClient, user2] = accounts;
  const name = "MyNFT";
  const symbol = "MNFT";
  const salt = "someSalt";
  const secret = "someSecret";
  const baseUri = "http://localhost:3000/mynft"
  let instance;

  beforeEach(async function () {
    instance = await MinterIMG.new(name, symbol, baseUri, salt, secret, whitelistedClient);
  });

  it("Should be owned by the deployer with the declared symbol, name: DUMMY DEPLOY TEST", async () => {
    expect(await instance.owner()).to.equal(owner);
    expect(await instance.name()).to.equal(name);
    expect(await instance.symbol()).to.equal(symbol);
  })
})

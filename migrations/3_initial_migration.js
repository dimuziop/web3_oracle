const ERC721Full = artifacts.require("ERC721Full");

module.exports = function (deployer) {
  deployer.deploy(ERC721Full);
};

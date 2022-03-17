const MinterIMG = artifacts.require("MinterIMG");

module.exports = function (deployer, network) {
  deployer.deploy(MinterIMG, "MyNFT", "MNFT", "http://localhost:3000", "salt", "secret", "0x8B4efB8b36919f671AaA574e6195ef84a7766a49");
};

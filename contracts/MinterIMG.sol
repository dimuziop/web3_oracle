// SPDX-License-Identifier: Unlicenced
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MinterIMG is ERC721, ERC721Enumerable, ERC721URIStorage {
    using SafeMath for uint256;

    uint256 public constant mintPrice = 0.005 ether;
    uint256 public maxMintAmount = 20;
    uint256 public maxSupply = 10000;
    bool public reveal = false;
    bool public paused = false;
    address owner;
    string baseUri;
    string private salt;
    string private secret;
    mapping(address => bool) public whitelisted;
    mapping(address => bool) public whitelistedClients;

    event __mintToken(bytes32 tokeinId, address to);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseUri_,
        string memory salt_,
        string memory secret_,
        address initialWhitelistedClient
    ) ERC721(name_, symbol_) {
        owner = msg.sender;
        baseUri = baseUri_;
        salt = salt_;
        secret = secret_;
        addClient(initialWhitelistedClient);
    }

    function addClient(address clientAddress) public onlyOwner {
        whitelistedClients[clientAddress] = true;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function startMinting(address to, uint256 tokenId) public {
        emit __mintToken(
            keccak256(abi.encodePacked(tokenId, salt, secret)),
            to
        );
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        if (reveal) {
            return super.tokenURI(tokenId);
        }
        return string(abi.encode(""));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mint(address _to, uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount);
        require(supply + _mintAmount <= maxSupply);

        if (msg.sender != owner) {
            if (whitelisted[msg.sender] != true) {
                require(msg.value >= mintPrice * _mintAmount);
            }
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(_to, supply + i);
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    modifier onlyWithelistedClients() {
        require(whitelistedClients[msg.sender], "Not valid client");
        _;
    }

    function revealMetadata() public onlyOwner {
        reveal = true;
    }

    function _baseURI()
        internal
        view
        virtual
        override(ERC721)
        returns (string memory)
    {
        return baseUri;
    }

    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner).call{value: address(this).balance}("");
        require(os);
    }

    function SetSecret(string memory _secret) public onlyOwner {
        secret = _secret;
    }

    function SetSalt(string memory _salt) public onlyOwner {
        salt = _salt;
    }
}

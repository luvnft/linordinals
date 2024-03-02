// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Ordinal.sol";

contract OrdinalFactory is Ownable, ReentrancyGuard {
    uint256 public fee;
    bool public paused = true;

    mapping(string => address) public getToken;
    address[] public allTokens;

    event TokenCreated(address indexed token, uint);

    constructor(uint256 _fee) {
        fee = _fee;
    }

    function allTokensLength() external view returns (uint) {
        return allTokens.length;
    }

    function createToken(
        string memory name,
        string memory symbol,
        string memory logo,
        uint256 maxSupply,
        uint256 limit,
        uint256 tokenFee
    ) external payable nonReentrant returns (address token) {
        require(!paused, "Paused");
        require(fee == msg.value, "Fee not paid");
        require(getToken[symbol] == address(0), "Token Exists");

        bytes memory createCode = type(Ordinal).creationCode;
        bytes memory bytecode = abi.encodePacked(createCode, abi.encode(
            msg.sender,
            name,
            symbol,
            logo,
            maxSupply,
            limit,
            tokenFee
        ));

        bytes32 salt = keccak256(abi.encodePacked(
            msg.sender,
            name,
            symbol,
            logo,
            maxSupply,
            limit,
            tokenFee
        ));

        assembly {
            token := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        require(token != address(0), "Create2: Failed on deploy");

        allTokens.push(token);
        getToken[symbol] = token;

        if (fee > 0) {
            payable(owner()).transfer(msg.value);
        }

        emit TokenCreated(token, allTokens.length);

        return token;
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    // Functions to control the paused state
    function pause() public onlyOwner {
        paused = true;
    }

    function unpause() public onlyOwner {
        paused = false;
    }
}
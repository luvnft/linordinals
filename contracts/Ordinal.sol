// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ordinal is ERC20, Ownable {
    string public protocol = "BLC-20";
    address public factory;
    address public creator;
    string public logo;
    uint256 public maxSupply;
    uint256 public limit;
    uint256 public fee;
    mapping(address => uint256) public mints;

    event Deploy(
        address indexed creator,
        string name,
        string indexed symbol,
        string logo,
        uint256 maxSupply,
        uint256 limit,
        uint256 fee
    );
    event Mint(
        address indexed by,
        uint256 amt
    );

    constructor(
        address creator_,
        string memory name_,
        string memory symbol_,
        string memory logo_,
        uint256 maxSupply_,
        uint256 limit_,
        uint256 fee_
    ) ERC20(
        name_,
        symbol_
    ) {
        require(limit_ <= maxSupply_, "Limit bigger than maxSupply");
        creator = creator_;
        factory = msg.sender;
        logo = logo_;
        maxSupply = maxSupply_;
        limit = limit_;
        fee = fee_;

        transferOwnership(creator);

        emit Deploy(creator, name_, symbol_, logo, maxSupply_, limit_, fee_);
    }

    function mint(uint256 amount) public payable {
        require(amount <= limit, "Over the limit");
        require(totalSupply() + amount <= maxSupply, "MaxSupply reached");
        require(fee == msg.value, "Fee not paid");

        _mint(_msgSender(), amount);

        if (fee > 0) {
            payable(owner()).transfer(msg.value);
        }

        mints[_msgSender()]++;

        emit Mint(_msgSender(), amount);
    }

    function owner_mint(uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "MaxSupply reached");

        _mint(_msgSender(), amount);

        mints[_msgSender()]++;

        emit Mint(_msgSender(), amount);
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }
}

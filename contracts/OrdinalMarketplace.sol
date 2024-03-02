// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Ordinal.sol";

contract OrdinalMarketplace is Ownable, ReentrancyGuard {
    uint256 private _listIdCounter;
    uint256 public commissionPercentage; // Commission percentage as an integer (e.g., 5 for 5%)
    bool public paused = true;

    struct Listing {
        address seller;
        address tokenAddress;
        string symbol;
        uint256 amount;
        uint256 value;
    }

    uint256[] public elements; // All the active listing Ids
    mapping(uint256 => uint256) private indexes; // listIds => Index in elements
    mapping(uint256 => Listing) public listings; // listIds => Listing

    // Events
    event List(address indexed seller, address indexed tokenAddress, string tokenSymbol, uint256 listingId, uint256 amount, uint256 value);
    event Purchase(address indexed buyer, address indexed seller, address indexed tokenAddress, string tokenSymbol, uint256 listingId, uint256 amount, uint256 value);
    event Cancelled(uint256 listingId, address indexed tokenAddress);

    constructor(uint256 _commissionPercentage) {
        require(_commissionPercentage < 100, "cannot have > 100 % commision");
        commissionPercentage = _commissionPercentage;
    }

    function listingsLength() external view returns (uint) {
        return elements.length;
    }

    function listTokens(address _tokenAddress, uint256 amount, uint256 value) public nonReentrant {
        require(!paused, "Paused");

        Ordinal token = Ordinal(_tokenAddress);

        require(token.balanceOf(msg.sender) >= amount, "Not enough tokens");
        require(token.allowance(msg.sender, address(this)) >= amount, "Marketplace not authorized to sell tokens");

        _listIdCounter++;

        token.transferFrom(msg.sender, address(this), amount);

        elements.push(_listIdCounter);
        indexes[_listIdCounter] = elements.length;
        listings[_listIdCounter] = Listing(msg.sender, _tokenAddress, token.symbol(), amount, value);

        emit List(msg.sender, _tokenAddress, token.symbol(), _listIdCounter, amount, value);
    }

    function buyTokens(uint256 listingId) public payable nonReentrant {
        require(!paused, "Paused");

        require(indexes[listingId] != 0, "Listing not found");

        Listing storage listing = listings[listingId];
        Ordinal token = Ordinal(listing.tokenAddress);

        uint256 commission = (listing.value * commissionPercentage) / 100;
        uint256 sellerAmount = listing.value - commission;

        require(msg.value == listing.value, "Incorrect value sent");
        require(token.balanceOf(address(this)) >= listing.amount, "Not enough tokens in the marketplace");

        payable(listing.seller).transfer(sellerAmount);
        payable(owner()).transfer(commission);
        token.transfer(msg.sender, listing.amount);

        // find out the index
        uint256 index = indexes[listingId];

        // moves last element to the place of the value
        // so there are no free spaces in the array
        uint256 lastValue = elements[elements.length - 1];
        elements[index - 1] = lastValue;
        indexes[lastValue] = index;

        // delete the index and listing
        delete indexes[listingId];
        delete listings[listingId];

        // deletes last element and reduces array size
        elements.pop();

        emit Purchase(msg.sender, listing.seller, listing.tokenAddress, token.symbol(), listingId, listing.amount, listing.value);
    }

    function cancelListing(uint256 listingId) public nonReentrant {
        require(indexes[listingId] != 0, "Listing not found");
        Listing storage listing = listings[listingId];
        require(msg.sender == listing.seller, "Only seller can cancel");

        // Return tokens to seller
        Ordinal token = Ordinal(listing.tokenAddress);
        token.transfer(listing.seller, listing.amount);

        // find out the index
        uint256 index = indexes[listingId];

        // moves last element to the place of the value
        // so there are no free spaces in the array
        uint256 lastValue = elements[elements.length - 1];
        elements[index - 1] = lastValue;
        indexes[lastValue] = index;

        // delete the index and listing
        delete indexes[listingId];
        delete listings[listingId];

        // deletes last element and reduces array size
        elements.pop();

        // Emit Cancelled event
        emit Cancelled(listingId, listing.tokenAddress);
    }

    function changeCommission(uint256 newCommissionPercentage) public onlyOwner {
        require(newCommissionPercentage < 100, "cannot have > 100 % commision");
        commissionPercentage = newCommissionPercentage;
    }

    // Functions to control the paused state
    function pause() public onlyOwner {
        paused = true;
    }

    function unpause() public onlyOwner {
        paused = false;
    }
}

import OrdinalMarketplaceMeta from '../contracts/OrdinalMarketplace.json';
import Addresses from '../contracts/Addresses.json';

const ethers = require("ethers");

export const listingsLength = async (provider, network) => {
  const contract = new ethers.Contract(Addresses[network].ordinalMarketplace, OrdinalMarketplaceMeta.output.abi, provider);
  const length = await contract.listingsLength();

  return length;
};

export const listingIdByIndex = async (provider, network, index) => {
  const contract = new ethers.Contract(Addresses[network].ordinalMarketplace, OrdinalMarketplaceMeta.output.abi, provider);
  const id = await contract.elements(index);

  return id;
};

export const listingById = async (provider, network, id) => {
  const contract = new ethers.Contract(Addresses[network].ordinalMarketplace, OrdinalMarketplaceMeta.output.abi, provider);
  const listing = await contract.listings(id);

  return {
    seller: listing.seller,
    tokenAddress: listing.tokenAddress,
    symbol: listing.symbol,
    amount: listing.amount,
    value: listing.value
  };
};

export const listToken = async (provider, network, tokenAddress, amount, value) => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(Addresses[network].ordinalMarketplace, OrdinalMarketplaceMeta.output.abi, signer);
  const tx = await contract.listTokens(tokenAddress, amount, value);
  return tx;
};

export const purchaseToken = async (provider, network, listingId, value) => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(Addresses[network].ordinalMarketplace, OrdinalMarketplaceMeta.output.abi, signer);
  return contract.buyTokens(listingId, { value });
};

export const cancelListing = async (provider, network, listingId) => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(Addresses[network].ordinalMarketplace, OrdinalMarketplaceMeta.output.abi, signer);
  return contract.cancelListing(listingId);
};

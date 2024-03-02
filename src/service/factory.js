import OrdinalFactoryMeta from '../contracts/OrdinalFactory.json';
import Addresses from '../contracts/Addresses.json';

const ethers = require("ethers");

export const allTokensLength = async (provider, network) => {
  console.log(Addresses[network].ordinalFactory);
  const contract = new ethers.Contract(Addresses[network].ordinalFactory, OrdinalFactoryMeta.output.abi, provider);
  const length = await contract.allTokensLength();

  return length;
};

export const tokenAddressByIndex = async (provider, network, index) => {
  const contract = new ethers.Contract(Addresses[network].ordinalFactory, OrdinalFactoryMeta.output.abi, provider);
  const address = await contract.allTokens(index);

  return address;
};

export const getFee = async (provider, network) => {
  const contract = new ethers.Contract(Addresses[network].ordinalFactory, OrdinalFactoryMeta.output.abi, provider);
  const fee = await contract.fee();

  return fee;
};

export const getTokenAddressFromSymbol = async (provider, network, symbol) => {
  const contract = new ethers.Contract(Addresses[network].ordinalFactory, OrdinalFactoryMeta.output.abi, provider);
  const address = await contract.getToken(symbol);

  return address;
}

export const createToken = async (provider, network, name, symbol, logo, maxSupply, limit, tokenFee, feeInWei) => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(Addresses[network].ordinalFactory, OrdinalFactoryMeta.output.abi, signer);
  const meta = {};
  if (feeInWei) {
    meta.value = feeInWei;
  }
  return contract.createToken(name, symbol, logo, maxSupply, limit, tokenFee, meta);
};

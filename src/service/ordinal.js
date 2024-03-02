import OrdinalMeta from '../contracts/Ordinal.json';

const ethers = require("ethers");

export const tokenByAddress = async (provider, address) => {
  const contract = new ethers.Contract(address, OrdinalMeta.output.abi, provider);

  const factory = await contract.factory();
  const creator = await contract.creator();
  const name = await contract.name();
  const symbol = await contract.symbol();
  let logo = '';
  try {
    logo = await contract.logo();
  } catch (e) {
    logo = '';
  }
  const maxSupply = await contract.maxSupply();
  const totalSupply = await contract.totalSupply();
  const limit = await contract.limit();
  const fee = await contract.fee();

  return {
    factory,
    creator,
    name,
    symbol,
    logo,
    maxSupply: maxSupply,
    totalSupply: totalSupply,
    limit: limit,
    fee: fee,
  };
};

export const tokenAllowance = async (provider, tokenAddress, address, spender) => {
  const contract = new ethers.Contract(tokenAddress, OrdinalMeta.output.abi, provider);
  const allowance = await contract.allowance(address, spender);

  return allowance;
};

// Transactions

export const increaseAllowance = async (provider, tokenAddress, spender, amount) => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, OrdinalMeta.output.abi, signer);
  return contract.increaseAllowance(spender, amount);
};

export const mintToken = async (provider, address, amount, fee) => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(address, OrdinalMeta.output.abi, signer);
  return contract.mint(amount, { value: fee });
};

export const tokenBalance = async (provider, tokenAddress, address) => {
  const contract = new ethers.Contract(tokenAddress, OrdinalMeta.output.abi, provider);
  const balance = await contract.balanceOf(address);

  return balance;
};

export const transferToken = async (provider, tokenAddress, to, amount) => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, OrdinalMeta.output.abi, signer);
  return contract.transfer(to, amount);
}

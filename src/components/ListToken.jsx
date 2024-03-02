import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useApiContext } from '../context/ApiContext';
import { useAdressContext } from '../context/AddressContext';
import { useLocation } from 'react-router-dom';
import { Input, Form, Button, Spin } from 'antd';
import queueNotification from '../utils/queueNotification';
import SuccessModal from './SuccessModal';
import TokenLogo from './TokenLogo';
import TokenVerified from './TokenVerified';
import Addresses from '../contracts/Addresses.json';
import { tokenByAddress, tokenBalance, tokenAllowance, increaseAllowance } from '../service/ordinal';
import { listToken } from '../service/marketplace';

const ethers = require('ethers');

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const ListToken = () => {
  const { address, provider } = useAdressContext();
  const { rpcProvider, symbol, network } = useApiContext();

  const query = useQuery();
  const [tokenAddress, setTokenAddress] = useState(query.get('address'));
  const [amount, setAmount] = useState(0);
  const [value, setValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockHash, setBlockHash] = useState('');
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState(new BigNumber(0));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rpcProvider || !tokenAddress) {
      return;
    }

    if (ethers.isAddress(tokenAddress) === false) {
      return;
    }

    const getToken = async () => {
      setLoading(true);

      console.log('here');
      const token = await tokenByAddress(rpcProvider, tokenAddress);

      console.log('token', token);
      setToken(token);
      setLoading(false);
    };

    getToken();
  }, [rpcProvider, tokenAddress]);

  useEffect(() => {
    if (!rpcProvider || !address || !tokenAddress) {
      return;
    }

    if (ethers.isAddress(tokenAddress) === false) {
      return;
    }

    const getBalance = async () => {
      setLoading(true);

      const balance = await tokenBalance(rpcProvider, tokenAddress, address);

      console.log('balance', balance);

      setBalance(balance);

      setLoading(false);
    };

    getBalance();
  }, [rpcProvider, tokenAddress, address]);


  const handleTokenAddressChange = (e) => {
    setTokenAddress(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleValueChange = (e) => {
    setValue(Number(e.target.value));
  };

  const handleApprove = async () => {
    console.log('selectedAddress', address);
    console.log('tokenAddress', tokenAddress);
    console.log('amount', amount);

    if (!address) {
      queueNotification({
        header: 'Error',
        message: 'Please connect wallet',
        status: 'error',
      });
      return;
    }

    if (!tokenAddress) {
      queueNotification({
        header: 'Error',
        message: 'Please provide token address',
        status: 'error',
      });
      return;
    }

    if (ethers.isAddress(tokenAddress) === false) {
      queueNotification({
        header: 'Error',
        message: 'Please provide valid token address',
        status: 'error',
      });
      return;
    }

    if (!amount || amount <= 0) {
      queueNotification({
        header: 'Error',
        message: 'Please provide amount',
        status: 'error',
      });
      return;
    }

    try {
      console.log(
        'Allow Token:',
        provider,
        tokenAddress,
        token.symbol,
        Addresses[network].ordinalMarketplace,
        ethers.parseEther(amount.toString()),
      );
      const allowanceReceipt = await increaseAllowance(
        provider,
        tokenAddress,
        Addresses[network].ordinalMarketplace,
        ethers.parseEther(amount.toString()),
      );

      await allowanceReceipt.wait();
      console.log(`Transaction successful with hash: ${allowanceReceipt.hash}`);
      setBlockHash(allowanceReceipt.hash);

      queueNotification({
        header: 'Success',
        message: 'Allowance increased successfully.',
        status: 'success',
      });
    } catch (error) {
      console.log(`Transaction failed with error: ${error.message}`);
      queueNotification({
        header: 'Error!',
        message: error.message,
        status: 'error',
      });
    }
  };

  const handleList = async () => {
    setIsModalOpen(false);

    console.log('selectedAddress', address);
    console.log('tokenAddress', tokenAddress);
    console.log('amount', amount);
    console.log('value', value);

    if (!address) {
      queueNotification({
        header: 'Error',
        message: 'Please connect wallet',
        status: 'error',
      });
      return;
    }

    if (!tokenAddress) {
      queueNotification({
        header: 'Error',
        message: 'Please provide token address',
        status: 'error',
      });
      return;
    }

    if (ethers.isAddress(tokenAddress) === false) {
      queueNotification({
        header: 'Error',
        message: 'Please provide valid token address',
        status: 'error',
      });
      return;
    }

    if (!amount || amount <= 0) {
      queueNotification({
        header: 'Error',
        message: 'Please provide amount',
        status: 'error',
      });
      return;
    }

    if (!value || value <= 0) {
      queueNotification({
        header: 'Error',
        message: 'Please provide value',
        status: 'error',
      });
      return;
    }

    if (new BigNumber(ethers.parseEther(amount.toString())).gt(new BigNumber(balance))) {
      queueNotification({
        header: 'Error',
        message: 'Insufficient token balance',
        status: 'error',
      });
      return;
    }

    const allowance = await tokenAllowance(rpcProvider, tokenAddress, address, Addresses[network].ordinalMarketplace);

    console.log('allowance', allowance);
    console.log('balance', balance);

    if (new BigNumber(ethers.parseEther(allowance.toString())).lt(new BigNumber(balance.toString()))) {
      queueNotification({
        header: 'Error',
        message: 'Please approve token first',
        status: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      console.log(
        'List Token:',
        provider,
        tokenAddress,
        token.symbol,
        ethers.parseEther(amount.toString()),
        ethers.parseEther(value.toString())
      );
      const mintReceipt = await listToken(
        provider,
        network,
        tokenAddress,
        ethers.parseEther(amount.toString()),
        ethers.parseEther(value.toString())
      );

      await mintReceipt.wait();
      console.log(`Transaction successful with hash: ${mintReceipt.hash}`);
      setBlockHash(mintReceipt.hash);
      setIsModalOpen(true);
      queueNotification({
        header: 'Success',
        message: 'Token created successfully.',
        status: 'success',
      });
    } catch (error) {
      console.log(`Transaction failed with error: ${error.message}`);
      queueNotification({
        header: 'Error!',
        message: error.message,
        status: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div className='flex items-center justify-center'>
        <SuccessModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          extrinsicHash={blockHash}
          title='Token listed Successfully'
        />
        <div className='flex flex-col gap-y-5 w-[500px]'>
          <h2 className='text-xl font-semibold text-white'>List MRC 20 token</h2>
          <Form className='flex flex-col gap-y-5'>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Enter Token Address*
              </label>
              <Input
                disabled={loading}
                value={tokenAddress}
                className='h-10 w-full rounded-xl'
                onChange={handleTokenAddressChange}
              />
            </div>
            <div className='flex flex-col'>
              <label
                htmlFor=''
                className='text-sm font-medium flex items-end justify-between'>
                <span>Enter Amount*</span>{' '}
                <div className='col-span-2 flex items-center gap-x-1 justify-center'>
                  <span>
                    Balance: {token && ethers.formatEther(balance.toString())}{' '}
                  </span>
                  <span className='font-semibold md:font-extrabold text-base italic'>{token?.symbol}</span>
                  <TokenLogo logo={token?.logo} />
                  <TokenVerified ticker={token?.symbol} />
                </div>
              </label>
              <Input
                disabled={loading}
                name='amount'
                type='number'
                placeholder='List Amount'
                className='rounded-xl m-0 h-10'
                onChange={handleAmountChange}
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Enter Value* (In {symbol})
              </label>
              <Input
                disabled={loading}
                name='value'
                type='number'
                placeholder='value'
                className='rounded-xl m-0 h-10'
                onChange={handleValueChange}
              />
            </div>
            <label>
              By continuing I agree to the{' '}
              <a
                target='_blank'
                href='/disclaimer'
                className='text-blue-500'
                rel='noreferrer'>
                disclaimer{' '}
              </a>
            </label>
            <div className='flex flex-row'>
              <div className='w-1/2'>
                <Button
                  disabled={loading}
                  loading={loading}
                  onClick={handleApprove}
                  className='w-full text-base font-medium bg-green h-10 rounded-lg flex items-center justify-center text-primary hover:text-primary focus:text-primary'>
                  Approve
                </Button>
              </div>
              <div className='w-1/2'>
                <Button
                  disabled={loading}
                  loading={loading}
                  onClick={handleList}
                  className='w-full text-base font-medium bg-pink h-10 rounded-lg flex items-center justify-center text-primary hover:text-primary focus:text-primary'>
                  List Token
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default ListToken;

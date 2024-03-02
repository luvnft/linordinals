import React, { useState, useEffect } from 'react';
import { useApiContext } from '../context/ApiContext';
import { useAdressContext } from '../context/AddressContext';
import BigNumber from 'bignumber.js';
import { useLocation } from 'react-router-dom';
import { Input, Form, Button, Spin } from 'antd';
import queueNotification from '../utils/queueNotification';
import SuccessModal from './SuccessModal';
import { mintToken, tokenByAddress } from '../service/ordinal';

const ethers = require('ethers');

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const MintToken = () => {
  const { address, provider } = useAdressContext();
  const { rpcProvider, symbol } = useApiContext();
  const query = useQuery();
  const [tokenAddress, setTokenAddress] = useState(query.get('address'));
  const [amount, setAmount] = useState(0);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockHash, setBlockHash] = useState('');

  useEffect(() => {
    if (!rpcProvider || !tokenAddress) {
      return;
    }

    if (ethers.isAddress(tokenAddress) === false) {
      return;
    }

    const getToken = async () => {
      setLoading(true);

      const token = await tokenByAddress(rpcProvider, tokenAddress);

      console.log('token', token);
      setToken(token);
      setLoading(false);
    };

    getToken();
  }, [rpcProvider, tokenAddress]);

  const handleTokenAddressChange = (e) => {
    setTokenAddress(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
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

    if (new BigNumber(ethers.parseEther(amount.toString())).gt(new BigNumber(token.limit))) {
      queueNotification({
        header: 'Error',
        message: `Please provide a amount under limit ${ethers.formatEther(token.limit)}`,
        status: 'error',
      });
      return;
    }

    if (
      new BigNumber(token.totalSupply)
        .add(new BigNumber(ethers.parseEther(amount.toString())))
        .gt(new BigNumber(token.maxSupply))
    ) {
      queueNotification({
        header: 'Error',
        message: 'Token is not mintable',
        status: 'error',
      });
      return;
    }

    try {
      console.log(
        'Mint Token:',
        provider,
        tokenAddress,
        token.symbol,
        ethers.parseEther(amount.toString()),
        token.fee.toString()
      );
      const mintReceipt = await mintToken(
        provider,
        tokenAddress,
        ethers.parseEther(amount.toString()),
        token.fee
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
  };

  return (
    <Spin spinning={loading}>
      <div className='flex items-center justify-center'>
        <div className='flex flex-col gap-y-5 w-[500px]'>
          <h2 className='text-xl font-semibold text-white'>Mint MRC 20 token</h2>
          <Form onFinish={handleSubmit} className='flex flex-col gap-y-5'>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Enter Token Address
              </label>
              <Input
                value={tokenAddress}
                disabled={loading}
                placeholder='0x1234...'
                className='h-10 w-full rounded-xl'
                onChange={handleTokenAddressChange}
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Enter Amount
              </label>
              <Input
                name='amount'
                type='number'
                disabled={loading}
                placeholder='Mint Amount'
                className='rounded-xl m-0 h-10'
                onChange={handleAmountChange}
              />
              {token ? <span className='font-medium'>Limit: {ethers.formatEther(token.limit.toString()).split('.')[0]} {token.symbol}</span> : null}
            </div>
            <div className='flex flex-col'>
              {token ? <span className='text-sm font-medium'>Minting: {amount} {token.symbol}</span> : null}
              {token ? <span className='text-sm font-medium'>fee: {ethers.formatEther(token.fee.toString())} {symbol}</span> : null}
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
              <Button
                loading={loading}
                disabled={loading}
                htmlType='submit'
                className='text-base font-medium bg-pink h-10 rounded-lg flex items-center justify-center text-primary hover:text-primary focus:text-primary'>
                Mint Token
              </Button>
            </div>
          </Form>
        </div>
        <SuccessModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          extrinsicHash={blockHash}
          title='Token minted successfully!'
        />
      </div>
    </Spin>
  );
};

export default MintToken;

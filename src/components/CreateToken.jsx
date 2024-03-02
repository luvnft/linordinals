import React, { useState, useEffect } from 'react';
import { useAdressContext } from '../context/AddressContext';
import { Input, Form, Button, Spin } from 'antd';
import queueNotification from '../utils/queueNotification';
import SuccessModal from './SuccessModal';
import { createToken, getTokenAddressFromSymbol, getFee } from '../service/factory';
import BigNumber from 'bignumber.js';
import { useApiContext } from '../context/ApiContext';

const ethers = require("ethers")

const CreateToken = () => {
  const { address, provider } = useAdressContext();
  const { network } = useApiContext();
  const [tokenName, setTokenName] = useState('');
  const [tick, setTick] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [limit, setLimit] = useState(0);
  const [mintFee, setMintFee] = useState('0');
  const [createFee, setCreateFee] = useState(new BigNumber(0));
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockHash, setBlockHash] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        console.log('here');
        const createFee = await getFee(provider, network);
        console.log('createFee', createFee);
        setCreateFee(createFee);
      } catch (error) {}
      setLoading(false);
    })();
  }, [provider, network]);

  const handleNameChange = (e) => {
    setTokenName(e.target.value);
  };

  const handleTickChange = (e) => {
    setTick(e.target.value);
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.value);
  };

  const handleTotalSupplyChange = (e) => {
    setTotalSupply(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };

  const handleMintFeeChange = (e) => {
    setMintFee(e.target.value);
  };

  const handleSubmit = async () => {
    console.log('address', address);
    console.log('tick', tick);
    console.log('totalSupply', totalSupply);
    console.log('limit', limit);
    console.log('mintFee', mintFee);
    console.log('logo', logo);

    if (!address) {
      queueNotification({
        header: 'Error',
        message: 'Please connect wallet',
        status: 'error',
      });
      return;
    }

    if (!tick) {
      queueNotification({
        header: 'Error',
        message: 'Please provide token symbol',
        status: 'error',
      });
      return;
    }

    if (!totalSupply) {
      queueNotification({
        header: 'Error',
        message: 'Please provide total supply',
        status: 'error',
      });
      return;
    }

    if (!limit) {
      queueNotification({
        header: 'Error',
        message: 'Please provide limit',
        status: 'error',
      });
      return;
    }

    if (new BigNumber(totalSupply).lt(new BigNumber(limit))) {
      queueNotification({
        header: 'Error',
        message: 'Total supply must be greater than and equal to limit',
        status: 'error',
      });
      return;
    }

    if (new BigNumber(limit).lt(new BigNumber(1))) {
      queueNotification({
        header: 'Error',
        message: 'Limit must be greater than and equal to 1',
        status: 'error',
      });
      return;
    }

    if (new BigNumber(mintFee).lt(new BigNumber(0))) {
      queueNotification({
        header: 'Error',
        message: 'Mint fee must be greater than and equal to 0',
        status: 'error',
      });
      return;
    }

    const tokenAddress = await getTokenAddressFromSymbol(provider, network, tick);

    if (tokenAddress && tokenAddress !== '0x0000000000000000000000000000000000000000') {
      queueNotification({
        header: 'Error',
        message: 'Token already exists',
        status: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      console.log(
        'Create Token:',
        provider,
        tokenName,
        tick,
        logo,
        ethers.parseUnits(totalSupply, 'ether'),
        ethers.parseUnits(limit, 'ether'),
        ethers.parseUnits(mintFee, 'ether'),
        createFee.toString()
      );
      const createReceipt = await createToken(
        provider,
        network,
        tokenName,
        tick,
        logo,
        ethers.parseUnits(totalSupply, 'ether'),
        ethers.parseUnits(limit, 'ether'),
        ethers.parseUnits(mintFee, 'ether'),
        createFee.toString()
      );

      await createReceipt.wait();
      console.log(`Transaction successful with hash: ${createReceipt.hash}`);
      setBlockHash(createReceipt.hash);

      queueNotification({
        header: 'Success',
        message: 'Token created successfully.',
        status: 'success',
      });
      setIsModalOpen(true);
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
        <div className='flex flex-col gap-y-5 w-[500px]'>
          <h2 className='text-xl font-semibold text-white'>
            Create MRC 20 token
          </h2>
          <Form onFinish={handleSubmit} className='flex flex-col gap-y-5'>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Name*
              </label>
              <Form.Item
                name='token_name'
                rules={[
                  {
                    required: true,
                    message: 'Token Name is required.',
                  },
                ]}
                className='m-0'>
                <Input
                  name='token_name'
                  type='text'
                  placeholder='Token Name'
                  className='rounded-lg m-0 h-10'
                  onChange={handleNameChange}
                />
              </Form.Item>
            </div>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Symbol*
              </label>
              <Form.Item
                name='token_symbol'
                rules={[
                  {
                    required: true,
                    message: 'Token Symbol is required.',
                  },
                ]}
                className='m-0'>
                <Input
                  name='token_symbol'
                  type='text'
                  placeholder='Token Symbol'
                  className='rounded-lg m-0 h-10'
                  onChange={handleTickChange}
                />
              </Form.Item>
            </div>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Token Logo Image Url (optional)
              </label>
              <Input
                name='tick_logo'
                type='text'
                placeholder='Token Logo Image Url'
                className='rounded-lg m-0 h-10'
                onChange={handleLogoChange}
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Total Supply*
              </label>
              <Form.Item
                name='total_supply'
                rules={[
                  {
                    required: true,
                    message: 'Token Total Supply is required.',
                  },
                ]}
                className='m-0'>
                <Input
                  name='total_supply'
                  type='number'
                  placeholder='Total Supply'
                  className='rounded-lg m-0 h-10'
                  onChange={handleTotalSupplyChange}
                />
              </Form.Item>
            </div>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Limit*
              </label>
              <Form.Item
                name='limit'
                rules={[
                  {
                    required: true,
                    message: 'Limit per Mint is required.',
                  },
                ]}
                className='m-0'>
                <Input
                  name='limit'
                  type='number'
                  placeholder='Limit per Mint'
                  className='rounded-lg m-0 h-10'
                  onChange={handleLimitChange}
                />
              </Form.Item>
            </div>
            <div className='flex flex-col'>
              <label htmlFor='' className='text-sm font-medium'>
                Minting Fee (optional)
              </label>
              <Form.Item
                name='fee'
                className='m-0'>
                <Input
                  name='fee'
                  type='number'
                  placeholder='Minting Fee'
                  className='rounded-lg m-0 h-10'
                  onChange={handleMintFeeChange}
                />
              </Form.Item>
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
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>fee: {ethers.formatEther(createFee.toString())}</span>
              <Button
                loading={loading}
                htmlType='submit'
                className='text-base font-medium bg-pink h-10 rounded-lg flex items-center justify-center text-primary hover:text-primary focus:text-primary'>
                Create Token
              </Button>
            </div>
          </Form>
        </div>
        <SuccessModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          extrinsicHash={blockHash}
          title='Token created successfully!'
        />
      </div>
    </Spin>
  );
};

export default CreateToken;

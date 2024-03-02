import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { Button, Spin, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useApiContext } from '../context/ApiContext';
import { useAdressContext } from '../context/AddressContext';
import Address from './Address';
import { useNavigate } from 'react-router-dom';
import { Card, Empty } from 'antd';
import TokenVerified from './TokenVerified';
import { tokenByAddress, tokenBalance } from '../service/ordinal';
import { addressLink } from '../utils/getExplorerLink';

const ethers = require('ethers');

function copy(text){
  navigator.clipboard.writeText(text)
}

const Token = () => {
  const params = useParams();
  const tokenAddress = params?.address;
  const { address } = useAdressContext();
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const { network, rpcProvider, symbol } = useApiContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!rpcProvider) {
      return;
    }

    const getToken = async () => {
      setLoading(true);

      try {
        const token = await tokenByAddress(rpcProvider, tokenAddress);

        console.log('token', token);
        setToken(token);
      } catch (error) {
        console.log('error', error);
      }

      setLoading(false);
    };

    getToken();
  }, [rpcProvider, tokenAddress]);

  useEffect(() => {
    if (!rpcProvider || !address) {
      return;
    }

    const getToken = async () => {
      const balance = await tokenBalance(rpcProvider, tokenAddress, address);

      console.log('balance', balance);

      setBalance(balance);
    };

    getToken();
  }, [rpcProvider, tokenAddress, address]);

  if (!loading && !token) {
    return (
      <section className='flex flex-col gap-y-5'>
        <Empty className='w-full' description='Token not found' />
      </section>
    );
  }

  return token ? (
    <section className='flex flex-col gap-y-5'>
      <div className='grid grid-cols-12 gap-5 text-primary'>
        <div className='col-span-12 md:col-span-8 flex flex-col gap-y-3'>
          <div className='flex items-center gap-2'>

            <span className='font-extrabold text-base italic'>
              {token.symbol}
            </span>
            <span className='flex items-center justify-center text-sm font-medium bg-pink text-darkBlue rounded-2xl px-2 whitespace-nowrap'>
              MRC-20
            </span>
            {token?.logo ? <span className='flex justify-end'>
              <img src={token?.logo} className='h-20' alt='token logo' />
            </span> : null}
            <TokenVerified ticker={token?.symbol} />
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>Address</div>
            <div className='font-medium text-base'>
              <Button
                type='link'
                target='_blank'
                href={addressLink(network, tokenAddress)}>
                <Address address={tokenAddress} />
              </Button>
              <Tooltip title="Copy Address">
                <Button onClick={() => copy(tokenAddress)} shape="circle" icon={<CopyOutlined />} />
              </Tooltip>
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>Author</div>
            <div className='font-medium text-base'>
              <Button
                type='link'
                target='_blank'
                href={addressLink(network, token?.creator)}>
                <Address address={token?.creator} />
              </Button>
              <Tooltip title="Copy Address">
                <Button onClick={() => copy(token?.creator)} shape="circle" icon={<CopyOutlined />} />
              </Tooltip>
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>
              Name
            </div>
            <div className='font-medium text-base'>
              {token.name}
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>
              Symbol
            </div>
            <div className='font-medium text-base'>
              {token.symbol}
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>
              My Balance
            </div>
            <div className='font-medium text-base'>
              {balance ? ethers.formatEther(balance?.toString()) : '0'} {token.symbol}
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>
              Max Supply
            </div>
            <div className='font-medium text-base'>
              {ethers.formatEther(token.maxSupply?.toString())}
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>
              Limit
            </div>
            <div className='font-medium text-base'>
              {ethers.formatEther(token.limit?.toString())}
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>
              Minting Fee
            </div>
            <div className='font-medium text-base'>
              {ethers.formatEther(token.fee?.toString())} {symbol}
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <div className='font-semibold text-lg'>Minted</div>
            <div className='font-medium text-base'>
              {ethers.formatEther(token.totalSupply?.toString())}
            </div>
          </div>
          {new BigNumber(token.totalSupply).lt(new BigNumber(token.maxSupply)) ? (
            <div className='grid grid-cols-10'>
              <div className='col-span-2 font-semibold text-lg'></div>
              <Button
                className='col-span-2 font-medium text-base'
                type='default'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigate(`/mint-token?address=${tokenAddress}`);
                }}>
                Mint
              </Button>
            </div>
          ) : null}
          {balance && new BigNumber(balance.toString()).gt(new BigNumber(0)) ? (
            <div className='grid grid-cols-10'>
              <div className='col-span-2 font-semibold text-lg'></div>
              <Button
                className='col-span-2 font-medium text-base'
                type='default'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigate(`/list-token?address=${tokenAddress}`);
                }}>
                List
              </Button>
            </div>
          ) : null}
        </div>
        <div className='col-span-12 md:col-span-4 flex items-center gap-x-1 justify-center'>
          <Card bordered={true} style={{ width: 400 }}>
            <pre>
              {JSON.stringify(
                {
                  p: 'mrc-20',
                  op: 'deploy',
                  tick: token.symbol,
                  max: ethers.formatEther(token.maxSupply?.toString()).split('.')[0],
                  lim: ethers.formatEther(token.limit?.toString()).split('.')[0],
                  fee: ethers.formatEther(token.fee?.toString()).split('.')[0]
                },
                null,
                4
              )}
            </pre>
          </Card>
        </div>
      </div>
    </section>
  ) : <Spin className='min-h-[300px] flex items-center justify-center' spinning={loading} />;
};

export default Token;

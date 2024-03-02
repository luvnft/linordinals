import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table } from 'antd';
import { tokenAddressByIndex, allTokensLength } from '../service/factory';
import { useApiContext } from '../context/ApiContext';
import { useAdressContext } from '../context/AddressContext';
import SelectAddressFromWallet from './SelectAddressFromWallet';
import { tokenByAddress, tokenBalance } from '../service/ordinal';
import shortenAddress from '../utils/shortenAddress';
import TokenLogo from './TokenLogo';

const ethers = require('ethers');

export const NavigationContext = React.createContext();

const Balance = () => {
  const { address } = useAdressContext();
  const [tokens, setTokens] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { rpcProvider, network } = useApiContext();

  const columns = [
    {
      title: 'Token',
      dataIndex: 'symbol',
      render: (_, token) => {
        return (
          <div className='flex items-center gap-x-1'>
            <TokenLogo logo={token?.logo} />
            <span className='font-semibold md:font-extrabold text-base italic'>{token.symbol}</span>
            <span className='flex items-center justify-center text-sm font-medium bg-pink text-darkBlue rounded-2xl px-2 whitespace-nowrap'>
              MRC-20
            </span>
          </div>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name) => <span>{name}</span>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (address) => <span>{shortenAddress(address, 15)}</span>,
    },
    {
      title: 'Minted',
      dataIndex: 'totalSupply',
      render: (totalSupply) => <span>{ethers.formatEther(totalSupply.toString()).split('.')[0]}</span>
    },
    {
      title: 'Max',
      dataIndex: 'maxSupply',
      render: (maxSupply) => <span>{ethers.formatEther(maxSupply?.toString()).split('.')[0]}</span>
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      render: (_, token) => <span>{ethers.formatEther(token.balance.toString()).split('.')[0]}</span>,
    },
    {
      title: 'List',
      dataIndex: 'list',
      render: (_, token) => (
        <Link
          id='mint'
          to={`/list-token?address=${token.address}`}
          className='underline cursor-pointer'>
          List
        </Link>
      ),
    },
  ];

  useEffect(() => {
    if (!rpcProvider || !network || !address) {
      return;
    }

    const getTokens = async () => {
      setLoading(true);
      const length = await allTokensLength(rpcProvider, network);

      if (!length || !Number(length.toString())) {
        setLoading(false);
        return;
      }

      const tokens = [];

      for (let i = 0; i < Number(length.toString()); i++) {

        const tokenAddress = await tokenAddressByIndex(rpcProvider, network, i);

        const token = await tokenByAddress(rpcProvider, tokenAddress);
        const balance = await tokenBalance(rpcProvider, tokenAddress, address);

        tokens.push({
          id: i + 1,
          address,
          balance,
          ...token,
        });
      }

      setTokens(tokens);
      setLoading(false);
    };

    getTokens();
  }, [rpcProvider, network, address]);

  return (
    <>
      {address ? (
        <div className='flex flex-col gap-y-5'>
          <section className='flex items-center justify-between'>
            <h3 className='text-2xl font-semibold'>
              Token Listing
            </h3>
          </section>
          <Table
            scroll={{ x: true }}
            rowKey="address"
            columns={columns}
            dataSource={tokens}
            loading={loading}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  if (e.target.id !== 'mint') {
                    navigate(`/token/${record.address}`);
                  }
                },
              };
            }}
          />
        </div>
      ) : (
        <div className='min-h-[500px] flex flex-column items-center justify-center'>
          <SelectAddressFromWallet />
        </div>
      )}
    </>
  );
};

export default Balance;

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import TokenLogo from './TokenLogo';
import { useApiContext } from '../context/ApiContext';
import { tokenAddressByIndex, allTokensLength } from '../service/factory';
import { tokenByAddress } from '../service/ordinal';
import shortenAddress from '../utils/shortenAddress';

const ethers = require("ethers");

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    sorter: true,
    render: (_, token) => (
      <div className='whitespace-nowrap'>
        {token.id}
      </div>
    ),
  },
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
    title: 'Limit',
    dataIndex: 'limit',
    render: (limit) => <span>{ethers.formatEther(limit?.toString()).split('.')[0]}</span>,
  },
  {
    title: 'Mint',
    dataIndex: 'mint',
    render: (_, token) => (
      <Link
        id='mint'
        to={`/mint-token?address=${token.address}`}
        className='underline cursor-pointer'>
        Mint
      </Link>
    ),
  },
];

const Tokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { rpcProvider, network } = useApiContext();

  useEffect(() => {
    if (!rpcProvider) {
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

        const address = await tokenAddressByIndex(rpcProvider, network, i);

        const token = await tokenByAddress(rpcProvider, address);

        tokens.push({
          id: i + 1,
          address,
          ...token,
        });
      }

      setTokens(tokens);
      setLoading(false);
    };

    getTokens();
  }, [rpcProvider, network]);

  return (
    <div className='flex flex-col gap-y-5'>
      <div className='flex items-center justify-between'>
        <h3 className='text-primary font-medium md:font-semibold text-base md:text-xl'>
          The full list of Tokens
        </h3>
      </div>
      <div className='flex flex-col gap-y-5'>
        <Table
          columns={columns}
          rowKey="id"
          pagination={false}
          dataSource={tokens}
          loading={loading}
          rowClassName='bg-body text-primary hover:bg-body'
          onRow={(record) => {
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
    </div>
  );
};

export default Tokens;

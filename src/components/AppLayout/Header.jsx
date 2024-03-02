import React from 'react';
import { Layout, Dropdown } from 'antd';
import { useApiContext, networks } from '../../context/ApiContext';
import { DownOutlined, MenuOutlined } from '@ant-design/icons';
import SelectAddressFromWallet from '../SelectAddressFromWallet';

const { Header: AntdHeader } = Layout;

const Header = ({ setSidedrawer }) => {
  const { network, setNetwork } = useApiContext();

  return (
    <AntdHeader className='bg-body flex items-center justify-between px-5'>
      <button
        className='bg-none border-none outline-none flex items-center justify-center cursor-pointer md:hidden'
        onClick={() => {
          setSidedrawer((prev) => {
            return !prev;
          });
        }}
      >
        <MenuOutlined className='text-xl' />
      </button>
      <p className='hidden md:flex m-0 text-lg font-semibold text-pink italic items-center gap-x-2'>
          {' '}
      </p>
      <div className='flex items-center gap-x-3'>
        <Dropdown
          menu={{
            items: Object.keys(networks).map((network, idx) => ({
              key: network,
              label: <span className='capitalize'>{network}</span>,
            })),
            onClick: ({ key }) => {
              setNetwork(key);
            },
          }}
          className='p-0 m-0 flex items-center justify-center'
        >
          <p className='border border-solid text-white border-gray-600 px-3 rounded-lg h-8 md:h-10 font-semibold text-sm min-w-[90px] md:min-w-[125px] capitalize flex items-center justify-between gap-x-2 cursor-pointer'>
            {network ? `${network}` : 'Select Network'}
            <DownOutlined className='text-xs' />
          </p>
        </Dropdown>
        <SelectAddressFromWallet />
      </div>
    </AntdHeader>
  );
};

export default Header;

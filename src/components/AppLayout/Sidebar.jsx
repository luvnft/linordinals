import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Drawer } from 'antd';
const { Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(
    <Link className='text-base font-medium' to='/'>
      Tokens
    </Link>,
    'tokens'
  ),
  {
    type: 'divider',
  },
  getItem(
    <Link className='text-base font-medium' to='/create-token'>
      Create Token
    </Link>,
    'create-token'
  ),
  getItem(
    <Link className='text-base font-medium' to='/mint-token'>
      Mint Token
    </Link>,
    'mint-token'
  ),
  getItem(
    <Link className='text-base font-medium' to='/transfer-token'>
      Transfer Token
    </Link>,
    'transfer-token'
  ),
  {
    type: 'divider',
  },
  getItem(
    <Link className='text-base font-medium' to='/balance'>
      My Token Balances
    </Link>,
    'balance'
  ),
  {
    type: 'divider',
  },
  getItem(
    <Link className='text-base font-medium' to='/marketplace'>
      Marketplace
    </Link>,
    'marketplace'
  ),
  getItem(
    <Link className='text-base font-medium' to='/list-token'>
      List Token
    </Link>,
    'list-token'
  ),
];

const collapsedItems = [
  getItem(
    <Link
      className='text-sm font-medium flex items-center justify-center h-full w-full'
      to='/'>
      <img className='w-8 h-8 rounded-md' src='/assets/tokens.png' alt='logo' />
    </Link>,
    'tokens'
  ),
  {
    type: 'divider',
  },
  getItem(
    <Link
      className='text-sm font-medium flex items-center justify-center h-full w-full'
      to='/create-token'>
      <img className='rounded-md' src='/assets/created-tokens.png' alt='logo' />
    </Link>,
    'create-token'
  ),
  getItem(
    <Link
      className='text-sm font-medium flex items-center justify-center h-full w-full'
      to='/mint-token'>
      <img className='rounded-md' src='/assets/mint-tokens.png' alt='logo' />
    </Link>,
    'mint-token'
  ),
  getItem(
    <Link
      className='text-sm font-medium flex items-center justify-center h-full w-full'
      to='/transfer-token'>
      <img
        className='rounded-md'
        src='/assets/transfer-tokens.png'
        alt='logo'
      />
    </Link>,
    'transfer-token'
  ),
  {
    type: 'divider',
  },
  getItem(
    <Link
      className='text-sm font-medium flex items-center justify-center h-full w-full'
      to='/balance'>
      <img
        className='rounded-md'
        src='/assets/my-token-balances.png'
        alt='logo'
      />
    </Link>,
    'balance'
  ),
  {
    type: 'divider',
  },
  getItem(
    <Link
      className='text-sm font-medium flex items-center justify-center h-full w-full'
      to='/marketplace'>
      <img className='rounded-md' src='/assets/marketplace.jpeg' alt='logo' />
    </Link>,
    'marketplace'
  ),
  getItem(
    <Link
      className='text-sm font-medium flex items-center justify-center h-full w-full'
      to='/list-token'>
      <img className='rounded-md' src='/assets/marketplace.jpeg' alt='logo' />
    </Link>,
    'list'
  ),
];

const Sidebar = ({ setSidedrawer, sidedrawer }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      <Drawer
        placement='left'
        closable={false}
        className={`max-w-[200px] md:hidden`}
        onClose={() => setSidedrawer(false)}
        open={sidedrawer}
        getContainer={false}
        // style={{
        // 	zIndex: '1005',
        // 	position: 'fixed',
        // 	height: '100vh',
        // 	bottom: 0,
        // 	left: 0
        // }}
        // contentWrapperStyle={{ position: 'fixed', height: '100vh', bottom: 0, left: 0 }}
      >
        <>
          <h1 className='flex items-center gap-x-2 text-pink font-semibold text-lg px-4 py-4'>
            <img className='w-8 h-8 rounded-md' src='/logo.png' alt='logo' />{' '}
            ZKORDS
          </h1>
          <Menu
            theme='dark'
            className='bg-transparent'
            selectedKeys={[
              location.pathname === '/'
                ? 'tokens'
                : location.pathname.replace('/', ''),
            ]}
            mode='inline'
            items={items}
          />
        </>
      </Drawer>
      <Sider
        className='hidden md:flex bg-body border-r border-solid border-gray-600'
        style={{
          background: 'var(--body)',
        }}
        width={'auto'}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        {collapsed ? (
          <>
            <div className='flex items-center justify-center px-4 py-4'>
              <img className='w-8 h-8 rounded-md' src='/logo.png' alt='logo' />
            </div>
            <Menu
              theme='dark'
              selectedKeys={[
                location.pathname === '/'
                  ? 'tokens'
                  : location.pathname.replace('/', ''),
              ]}
              mode='inline'
              items={collapsedItems}
            />
          </>
        ) : (
          <>
            <h1 className='flex items-center gap-x-2 text-pink font-semibold text-lg px-4 py-4'>
              <img className='w-8 h-8 rounded-md' src='/logo.png' alt='logo' />{' '}
              ZKORDS
            </h1>
            <Menu
              theme='dark'
              className='bg-transparent'
              selectedKeys={[
                location.pathname === '/'
                  ? 'tokens'
                  : location.pathname.replace('/', ''),
              ]}
              mode='inline'
              items={items}
            />
          </>
        )}
      </Sider>
    </>
  );
};

export default Sidebar;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateToken from '../CreateToken';
import MintToken from '../MintToken';
import TransferToken from '../TransferToken';
import NotFound from '../NotFound';
import Token from '../Token';
import Balance from '../Balance';
import Marketplace from '../Marketplace';
import Tokens from '../Tokens';
import ListToken from '../ListToken';
import Disclaimer from '../Disclaimer';

const CustomContent = () => {
  return (
    <div className='p-6 flex-1'>
      <div className='bg-body p-4 rounded-xl border border-solid border-gray-600'>
        <Routes>
          <Route path='/' element={<Tokens />} />
          <Route path='/token/:address' element={<Token />} />
          <Route path='/create-token' element={<CreateToken />} />
          <Route path='/mint-token' element={<MintToken />} />
          <Route path='/transfer-token' element={<TransferToken />} />
          <Route path='/balance' element={<Balance />} />
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/list-token' element={<ListToken />} />
          <Route path='/disclaimer' element={<Disclaimer />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomContent;

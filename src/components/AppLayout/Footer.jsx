import React from 'react';
import { Layout } from 'antd';

const { Footer: AntdFooter } = Layout;

const Footer = () => {
  return (
    <AntdFooter className='w-full flex px-5 py-2'>
        <div className='flex flex-col md:flex-row md:items-center gap-x-3'>
            <span>Copyright © 2023-2025 ZKOrdinals</span>
            <div className='flex items-center gap-x-3'>
                {/* <a target='_blank' href="#" className='bg-black w-8 h-8 rounded-md flex items-center justify-center' rel="noreferrer">
                    <img src="/assets/telegram.svg" className='w-6 h-6' alt="" />
                </a>
                <a target='_blank' href="#" className='bg-black w-8 h-8 rounded-md flex items-center justify-center' rel="noreferrer">
                    <img src="/assets/docs.svg" className='w-6 h-6' alt="" />
                </a>
                <a target='_blank' href="#" className='bg-black w-8 h-8 rounded-md flex items-center justify-center' rel="noreferrer">
                    <img src="/assets/twitter.svg" className='w-6 h-6' alt="" />
                </a> */}
                <a target='_blank' href='/disclaimer' className='bg-black w-10 h-10 rounded-md flex items-center justify-center' rel='noreferrer'>
                    <img src='/assets/info.png' className='w-6 h-6' alt='' />
                </a>
            </div>
        </div>
    </AntdFooter>
  );
};

export default Footer;

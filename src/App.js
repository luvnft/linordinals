// src/App.js

import React, { useState } from 'react';

import './App.css';
import Footer from './components/AppLayout/Footer';
import { Layout } from 'antd'
import CustomContent from './components/AppLayout/Content';
import Header from './components/AppLayout/Header';
import Sidebar from './components/AppLayout/Sidebar';
import { ConfigProvider, theme } from 'antd';
const { darkAlgorithm } = theme;
const { Content } = Layout;

const App = () => {
  const [sidedrawer, setSidedrawer] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: '#FF87EE',
        }
      }}
    >
      <Layout
        style={{
          minHeight: '100vh'
        }}
      >
        <Sidebar setSidedrawer={setSidedrawer} sidedrawer={sidedrawer} />
        <Layout>
          <Header setSidedrawer={setSidedrawer} />
          <Content className='overflow-y-auto max-h-[calc(100vh-65px)] bg-body'>
              <div className='flex flex-col h-full'>
                  <CustomContent />
                  <Footer />
              </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
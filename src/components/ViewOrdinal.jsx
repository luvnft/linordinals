// src/components/ViewOrdinal.js

import React, { useState } from 'react';
import { useApiContext } from '../context/ApiContext';
import { Input, Form, Button } from 'antd';
import queueNotification from '../utils/queueNotification';

const Buffer = require('buffer/').Buffer

const ViewOrdinal = () => {
    const { api } = useApiContext();
    const [txnId, setTxnId] = useState('');
    const [fileData, setFileData] = useState(null);

    const handleChange = (e) => {
        setTxnId(e.target.value);
    };

    const handleSubmit = async () => {

        try {
            const blockHash = await api.rpc.chain.getBlockHash(txnId.split('-')[0]);
            const signedBlock = await api.rpc.chain.getBlock(blockHash);

            // Assuming the data is in the first extrinsic (this may vary)
            const extrinsics = signedBlock.block.extrinsics;

            extrinsics.forEach((extrinsic) => {
              const { method: { args, method, section } } = extrinsic;

                if (section === 'system' && method === 'remarkWithEvent') {

                  const data = args[0].toString(); // Getting the first argument of the remarkWithEvent

                  // convert data hex to string

                  const parsedData = JSON.parse(data);

                  if (parsedData && parsedData.data) {
                      // Convert hex back to binary for display
                      const binaryData = Buffer.from(parsedData.data, 'hex');
                      const blob = new Blob([binaryData], { type: parsedData.type });
                      const fileUrl = URL.createObjectURL(blob);

                      setFileData({ ...parsedData, url: fileUrl });
                  }
                }
            });
        } catch (error) {
            console.error('Error fetching transaction:', error);
            queueNotification({
                header: 'Error',
                message: 'Failed to fetch transaction',
                status: 'error'
            });
        }
    };

    return (
      <div className="flex items-center justify-center">
        <div className='flex flex-col gap-y-5 w-[500px]'>
          <h2 className='text-xl font-semibold text-white'>View Ordinal</h2>
          <Form onFinish={handleSubmit} className='flex flex-col gap-y-5'>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-sm font-medium'>Transaction ID or Block number</label>
                    <Input
                        name="amount"
                        type="text"
                        placeholder="Enter Transaction ID"
                        className='rounded-xl m-0 h-10'
                        value={txnId}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-col'>
                    <Button htmlType='submit' className='text-base font-medium bg-pink h-10 rounded-lg flex items-center justify-center text-primary hover:text-primary focus:text-primary'>View</Button>
                </div>
          </Form>

          {fileData && (
              <div className="file-details">
                  <h3>File Details:</h3>
                  <p>Name: {fileData.name}</p>
                  <p>Size: {fileData.size} bytes</p>
                  <p>Type: {fileData.type}</p>
                  {fileData.type.startsWith('image/') && <img src={fileData.url} alt="Uploaded" />}
                  <a target='_blank' rel='noreferrer' href={fileData.url}>Download</a>
              </div>
          )}
        </div>
      </div>
    );
};

export default ViewOrdinal;

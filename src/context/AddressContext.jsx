import React, { useContext, useState } from 'react';
import { Modal } from 'antd';

const ethers = require("ethers");

export const AddressContext = React.createContext({
  address: '',
  provider: null,
  accounts: [],
  setAddress: () => {},
  connectWallet: () => {},
});

export function AddressContextProvider(props) {
  const { children = null } = props;
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
      setIsModalOpen(true);
  };

  const handleCancel = () => {
      setIsModalOpen(false);
  };

  const connectWallet = async () => {
    if (!window || !window.ethereum) {
      showModal();
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' })

		const provider = new ethers.BrowserProvider(window.ethereum);

    console.log(await provider.getBlockNumber());

    await provider.send("eth_requestAccounts", []);

		const accounts = await provider.listAccounts();

    console.log('accounts', accounts);

    setProvider(provider);
		setAccounts(accounts);

    if (accounts.length > 0) {
      setAddress(accounts[0].address);
    } else {
      showModal();
    }

		return;
  };

  return (
    <AddressContext.Provider
      value={{
        address,
        provider,
        accounts,
        setAddress,
        connectWallet,
      }}
    >
      {children}
      <Modal title="Install Wallet" open={isModalOpen} onCancel={handleCancel} onOk={handleCancel} okType="default">
          <p>Please install EVM compatible wallet: </p><br/>
          <p>Recommended: <a target='_blank' rel="noreferrer" href="https://metamask.io/">metamask.io/ 🔗</a></p>
          <p>After Installation Reload this page</p>
      </Modal>
    </AddressContext.Provider>
    );
}

export const useAdressContext = () => {
  return useContext(AddressContext);
};
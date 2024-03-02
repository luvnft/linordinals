import { Button } from 'antd';
import Address from './Address';
import { useAdressContext } from '../context/AddressContext';

const SelectAddressFromWallet = () => {
  const { address, connectWallet } = useAdressContext();

  const requestAccount = async function () {
    console.log('requestAccount');
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await connectWallet();
  }

  return (
    <>
      <Button
        type='default'
        onClick={requestAccount}
        className='flex items-center justify-center h-8 md:h-10 text-white border-gray-600'>
        {!address ? (
          'Connect Wallet'
        ) : (
          <Address identiconSize={18} address={address}  />
        )}
      </Button>
    </>
  );
};
export default SelectAddressFromWallet;

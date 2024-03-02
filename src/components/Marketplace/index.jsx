import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useApiContext } from '../../context/ApiContext';
import { useAdressContext } from '../../context/AddressContext';
import { Card, Spin, Button, Divider, Input, Empty } from 'antd';
import Address from '../Address';
import { UNDER_MAINTENANCE } from '../../constants';
import queueNotification from '../../utils/queueNotification';
import SuccessModal from '../SuccessModal';
import { listingIdByIndex, listingById, listingsLength, cancelListing, purchaseToken } from '../../service/marketplace';
import { tokenByAddress } from '../../service/ordinal';
import TokenLogo from '../TokenLogo';
import TokenVerified from '../TokenVerified';
import UnderMaintenance from './UnderMaintenance';

const ethers = require("ethers");

const getBN = (value) => {
  return new BigNumber(value?.toString());
};

const Marketplace = () => {
  const { address, provider } = useAdressContext();
  const { rpcProvider, symbol, network } = useApiContext();
  const [loading, setLoading] = useState({});
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [sortBy, setSortBy] = useState('id_ASC');
  const [searchTokenSymbol, setSearchTokenSymbol] = useState('');
  const [blockHash, setBlockHash] = useState('');

  useEffect(() => {
    if (!rpcProvider) {
      return;
    }

    const getListings = async () => {
      setLoading(true);
      const length = await listingsLength(rpcProvider, network);

      if (!length || !Number(length.toString())) {
        setLoading(false);
        return;
      }

      const listings = [];

      for (let i = 0; i < Number(length.toString()); i++) {
        const id = await listingIdByIndex(rpcProvider, network, i);
        const listing = await listingById(rpcProvider, network, id);
        const token = await tokenByAddress(rpcProvider, listing.tokenAddress);

        listings.push({
          id,
          ...listing,
          valuePerToken: getBN(listing.value).div(getBN(listing.amount)),
          token
        });
      }

      console.log('listings', listings);

      setListings(listings);
      setLoading(false);
    };

    getListings();
  }, [rpcProvider, network]);

  const handleSearchTokenSymbolChange = (e) => {
    setSearchTokenSymbol(e.target.value);
  };

  const handleCancel = async (list) => {
    setIsModalOpen(false);
    const listingId = list.id;
    const symbol = list.token?.symbol;

    console.log('selectedAddress', address);
    console.log('symbol', symbol);
    console.log('listingId', listingId);

    if (!address) {
      queueNotification({
        header: 'Error',
        message: 'Please connect wallet',
        status: 'error',
      });
      return;
    }

    if (!listingId) {
      queueNotification({
        header: 'Error',
        message: 'listing id not valid',
        status: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      console.log(
        'Cancel Token:',
        listingId,
        symbol,
      );
      const cancelReceipt = await cancelListing(provider, network, listingId.toString());

      await cancelReceipt.wait();
      console.log(`Transaction successful with hash: ${cancelReceipt.hash}`);
      setBlockHash(cancelReceipt.hash);

      queueNotification({
        header: 'Success',
        message: 'Listing cancelled successfully.',
        status: 'success',
      });
      setIsModalOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(`Cancellation failed with error: ${error.message}`);
      queueNotification({
        header: 'Error!',
        message: error.message,
        status: 'error',
      });
    }
    setLoading(false);
  };

  const handlePurchase = async (list) => {
    setIsModalOpen(false);
    const listingId = list.id;
    const value = list.value;
    const symbol = list.token?.symbol;

    console.log('selectedAddress', address);
    console.log('symbol', symbol);
    console.log('listingId', listingId);
    console.log('value', value);

    if (!address) {
      queueNotification({
        header: 'Error',
        message: 'Please connect wallet',
        status: 'error',
      });
      return;
    }

    if (!listingId) {
      queueNotification({
        header: 'Error',
        message: 'listing id not valid',
        status: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      console.log(
        'Purchase Token:',
        listingId,
        symbol,
        value
      );
      const purchaseReceipt = await purchaseToken(provider, network, listingId.toString(), value.toString());

      await purchaseReceipt.wait();
      console.log(`Purchase successful with hash: ${purchaseReceipt.hash}`);
      setBlockHash(purchaseReceipt.hash);

      queueNotification({
        header: 'Success',
        message: 'Purchase successful.',
        status: 'success',
      });
      setIsModalOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(`Purchase failed with error: ${error.message}`);
      queueNotification({
        header: 'Error!',
        message: error.message,
        status: 'error',
      });
    }
    setLoading(false);
  };

  // const options = [
  //   {
  //     label: 'ID ASC',
  //     value: 'id_ASC',
  //   },
  //   {
  //     label: 'ID DESC',
  //     value: 'id_DESC',
  //   },
  //   {
  //     label: 'Amount ASC',
  //     value: 'amount_ASC',
  //   },
  //   {
  //     label: 'Amount DESC',
  //     value: 'amount_DESC',
  //   },
  //   {
  //     label: 'Value ASC',
  //     value: 'value_ASC',
  //   },
  //   {
  //     label: 'Value DESC',
  //     value: 'value_DESC',
  //   }
  // ];

  if (UNDER_MAINTENANCE) {
    return <UnderMaintenance />
  }

  let filtered = listings;

  if (searchTokenSymbol?.length > 0) {
    filtered = listings.filter((list) => {
      return list.token.symbol?.toLowerCase().startsWith(searchTokenSymbol);
    });

    // .sort((a, b) => {
    //   if (sortBy === 'id_DESC') {
    //     return Number(b.id?.toString()) - Number(a.id.toString())
    //   }

    //   if (sortBy === 'amount_ASC') {
    //     return getBN(a.amount).sub(getBN(b.amount)).toNumber();
    //   }
    //   if (sortBy === 'amount_DESC') {
    //     return getBN(b.amount).sub(getBN(a.amount)).toNumber();
    //   }

    //   if (sortBy === 'value_ASC') {
    //     return getBN(a.value).sub(getBN(b.value)).toNumber();
    //   }
    //   if (sortBy === 'value_DESC') {
    //     return getBN(b.value).sub(getBN(a.value)).toNumber();
    //   }

    //   return Number(a.id?.toString()) - Number(b.id.toString());
    // });
  }

  return (
    <Spin spinning={loading} className=''>
      <article className='flex flex-col gap-y-5 min-h-[100px]'>
        <section className='flex items-center justify-between'>
          <h3 className='text-2xl font-semibold'>
            Token Listing
          </h3>
          <article className='flex flex-col md:flex-row items-center gap-5'>
            {/* <Select
              className='text-white flex items-center justify-center rounded-[4px] w-[150px]'
              placeholder='Sort By'
              options={options}
              onChange={(e)=> setSortBy(e)}
            /> */}
            <Input
              placeholder="Token Symbol"
              onChange={handleSearchTokenSymbolChange}
              type='text'
              className='max-w-[150px] md:max-w-[200px]'
            />
          </article>
        </section>

        <div className='flex items-center gap-5 flex-wrap'>
          {filtered.length === 0 ? <Empty className='w-full' /> : filtered.map((list, idx) => {
            return (
              <Card
                key={idx}
                className='w-full md:w-fit min-w-[200px] cursor-pointer'
                title={
                  <div className='col-span-2 flex items-center gap-x-1'>
                    <TokenLogo logo={list?.token?.logo} />
                    <span className='font-semibold md:font-extrabold text-base italic'>{list?.token?.symbol}</span>
                    <span className='flex items-center justify-center text-sm font-medium bg-pink text-darkBlue rounded-2xl px-2 whitespace-nowrap'>
                      MRC-20
                    </span>
                    <TokenVerified ticker={list?.token?.symbol} />
                  </div>
                }
              >
                <div className='flex flex-col gap-y-5'>
                  <div className='flex items-center justify-center text-xl font-semibold'>
                    Amount: {list.amount && ethers.formatEther(list.amount?.toString())}
                  </div>
                  <div className='flex items-center justify-between gap-x-2'>
                    <span>#{list.id?.toString()}</span>
                    {
                      list?.seller?
                        <Address
                          identiconSize={16}
                          addressClassName='text-xs'
                          addressMaxLength={10}
                          address={list?.seller}
                        />
                      : null
                    }
                  </div>
                  <Divider className='my-0' />
                  <div className='flex items-center justify-between gap-x-2'>
                    <span>Value</span>
                    <span>{list.value && ethers.formatEther(list.value?.toString())} {symbol}</span>
                  </div>
                  <div className='flex items-center justify-between gap-x-2'>
                    <span>Value per token</span>
                    <span>{list.valuePerToken?.toNumber()?.toFixed(3).toString()} {symbol}</span>
                  </div>
                  <label>
                    By continuing I agree to the{' '}
                    <a
                      target='_blank'
                      href='/disclaimer'
                      className='text-blue-500'
                      rel='noreferrer'>
                      disclaimer{' '}
                    </a>
                  </label>
                  <div className='flex items-center justify-center gap-x-2'>

                    <Button
                      loading={loading}
                      disabled={loading}
                      onClick={() => handlePurchase(list)}
                      className='w-full font-medium'
                    >
                      Buy
                    </Button>

                    {
                      address?
                       list?.seller === address ?
                          <Button
                            loading={loading}
                            disabled={loading}
                            onClick={() => handleCancel(list)}
                            className='w-full font-medium'
                          >
                            Cancel
                          </Button>
                        : null
                      : null
                    }
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </article>
      <SuccessModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        extrinsicHash={blockHash}
        title='Transaction successful!'
      />
    </Spin>
  );
};

export default Marketplace;

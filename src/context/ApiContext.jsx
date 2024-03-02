import React, { useContext, useEffect, useState } from 'react';
import queueNotification from '../utils/queueNotification';

const ethers = require("ethers");

export const networks = {
    'astarZkEvm': {
        rpc: 'https://rpc.startale.com/astar-zkevm',
        chainId: 3776,
        symbol: 'ETH',
        tokenDecimals: 18
    },
    'zkatana': {
        rpc: 'https://rpc.startale.com/zkatana',
        chainId: 1261120,
        symbol: 'ETH',
        tokenDecimals: 18
    }
};

const switchNetwork = async (network) => {
	const { chainId, rpc, symbol, tokenDecimals } = networks[network];
	const metaMaskChainId = await window.ethereum.request({ method: 'eth_chainId' });
	if (parseInt(metaMaskChainId, 16) !== chainId) {
		const newChainId = `0x${chainId.toString(16)}`;
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: newChainId }]
			});
		} catch (error) {
			if (typeof error?.message === 'string' && error?.message.includes('wallet_addEthereumChain')) {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: newChainId,
							chainName: network,
							nativeCurrency: {
								decimals: tokenDecimals,
								name: network,
								symbol: symbol
							},
							rpcUrls: [rpc]
						}
					]
				});
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: newChainId }]
				});
			}
		}
	}
};


export const ApiContext = React.createContext({
    rpcProvider: null,
    symbol: 'ETH',
    network: 'astarZkEvm',
    setNetwork: () => {}
});

export function ApiContextProvider(props) {
	const { children = null } = props;
    const [network, setNetwork] = useState('astarZkEvm');
    const [symbol, setSymbol] = useState('ETH');
    const [rpcProvider, setRpcProvider] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const provider = new ethers.JsonRpcProvider(networks[network].rpc, {
                    chainId: networks[network].chainId,
                    name: network,
                });

                setRpcProvider(provider);
                setSymbol(networks[network].symbol);

                await switchNetwork(network);
            } catch (error) {
                console.log('Error while connecting to rpc: ', error);
                queueNotification({
                    header: 'Error!',
                    message: 'RPC connection error.',
                    status: 'error'
                });
            }
        })();
    }, [network]);

	return (
        <ApiContext.Provider
            value={{
                rpcProvider,
                symbol,
                network,
                setNetwork,
            }}
        >
            {children}
        </ApiContext.Provider>
    );
}

export const useApiContext = () => {
    return useContext(ApiContext);
};
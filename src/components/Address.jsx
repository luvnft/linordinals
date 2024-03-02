import React from 'react';
import classNames from 'classnames';
import Identicon from '@polkadot/react-identicon';


export const shortenAddress = (address, maxLength) => {
	if (address.length <= maxLength) {
		return address;
	}

	const startStr = address.slice(0, maxLength / 2 - 1);
	const endStr = address.slice(address.length - maxLength / 2 + 1);

	return `${startStr}...${endStr}`;
};

const Address = (props) => {
	const { address, name, addressMaxLength, className, identiconSize, addressClassName } = props;
	return (
		<div className={classNames('flex items-center gap-x-2', className)}>
			<Identicon
					className=''
					value={address}
					size={identiconSize? identiconSize: 25}
					theme={'polkadot'}
			/>
			<div id="addressText" className={classNames('m-0 p-0', addressClassName)}>
				{
					name?
					name
					: shortenAddress(address, addressMaxLength || 15)
				}
			</div>
		</div>
	);
};

export default Address;
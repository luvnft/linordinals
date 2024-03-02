const shortenAddress = (address, maxLength) => {
	if (address.length <= maxLength) {
		return address;
	}

	const startStr = address.slice(0, maxLength / 2 - 1);
	const endStr = address.slice(address.length - maxLength / 2 + 1);

	return `${startStr}...${endStr}`;
};

export default shortenAddress;
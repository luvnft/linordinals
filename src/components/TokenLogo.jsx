import React from 'react'

const TokenLogo = ({ logo }) => {
    if (!logo || !logo?.includes('https://')) {
        return null;
    }
    return (
        <div className='flex items-center justify-center'>
            <img src={logo} className='h-6 w-6' alt='token logo' />
        </div>
    );
}

export default TokenLogo
import React from 'react'

const TokenVerified = ({ ticker }) => {
  return (
    <>
        {
            ticker === "WOOD"?
            <div>
              <img src='/assets/verified-tick.svg' className='h-5 w-5' alt='verified tick' />
            </div>
            : null
        }
    </>
  )
}

export default TokenVerified
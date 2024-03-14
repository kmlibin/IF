'use client'
import React from 'react'
import { useCart } from '@/context/CartContext'



type ValidateShippingProps = {
    validatedAddress: any,
    userAddress: any,
    setSelectedAddress: any,
    handleSetAddress: any
}

const ValidateShipping = ({validatedAddress, userAddress, setSelectedAddress, handleSetAddress}: ValidateShippingProps) => {

    const { state, dispatch } = useCart();
    const { contactInfo } = state
  return (
    <>
    {validatedAddress && (
        <div className="w-full flex">
          <div className="flex flex-col w-1/2">
            <input
              type="radio"
              id="userAddress"
              name="addressType"
              value={userAddress}
              onChange={() => setSelectedAddress(userAddress)}
            />
            <label htmlFor="userAddress">Address you entered:</label>
            <p>{userAddress}</p>
          </div>
          <div className="flex flex-col w-1/2">
            <input
              type="radio"
              id="validatedAddress"
              name="addressType"
              value={validatedAddress}
              onChange={() => setSelectedAddress(validatedAddress)}
            />
            <label htmlFor="validatedAddress">Validated Address:</label>
            <p>{validatedAddress}</p>
          </div>
          <button onClick={handleSetAddress}>Submit</button>
        </div>
      )}

      {contactInfo?.address && (
        <div>
          <p>Selected Address:</p>
          <p>{contactInfo.address}</p>
        </div>
      )} 
      </>
  )
}

export default ValidateShipping
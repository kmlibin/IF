'use client'
import React from 'react'

interface OrderPageProps {
    params: {
      id: string;
    };
  }

const ConfirmOrderPage = (props: OrderPageProps) => {
    const { params } = props;
    console.log(params)
  return (
    <div>confirm order page</div>
  )
}

export default ConfirmOrderPage
'use client'
import React from 'react'

interface OrderPageProps {
    params: {
      confirmOrderId: string;
    };
  }

const ConfirmOrderPage = (props: OrderPageProps) => {
    const { params } = props;
    console.log(params)
  return (
    <div>confirmorder id page</div>
  )
}

export default ConfirmOrderPage
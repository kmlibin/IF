import React from 'react'
import { getProductById } from '@/app/firebase/queries';
import EditForm from './EditForm'


interface EditPageProps {
    params: {
      productId: string;
    };
  }

const EditProductPage = async (props: EditPageProps) => {
    const { params } = props;
    const productId = params.productId;
    const productData = await getProductById(productId)

    console.log(productData)
   
  return (
    <EditForm product={productData}/>
  )
}

export default EditProductPage
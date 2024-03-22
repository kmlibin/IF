"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { createProduct, editProduct } from "@/app/actions";

import { uploadImage } from "@/app/actions";


interface Product {
    id: string;
    data: {
      images?: string[];
      name: string;
      quantity: number | string;
      price: number | string;
      keywords?: string[];
      type: string;
      isActive: boolean;
      description: string;
    };
  }
  

interface EditFormProps {
    product: any
}

const EditForm = ({product} : EditFormProps) => {
const [images, setImages] = useState<File[]>([]);
const [imagesError, setImagesError] = useState<string | null>(null);
const [formData, setFormData] = useState<any>({
  images: product.data.images,
  name: product.data.name,
  description: product.data.description,
  price: product.data.price,
  type: product.data.type,
  quantity: product.data.quantity,
  keywords: product.data.keywords,
  isActive: product.data.isActive
});

console.log(product)

const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setFormData((prevFormData :any) => ({
    ...prevFormData,
    [name]: value,
  }));
};

const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;
  setFormData((prevFormData: any) => ({
    ...prevFormData,
    keywords: value.split(",").map((keyword) => keyword.trim()),
  }));
};

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = e.target.files;
  if (!selectedFiles) return;

  const filesArray = Array.from(selectedFiles);
  setImages(filesArray);

  // Reset errors
  setImagesError(null);
};

const handleActiveChange = () => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      isActive: true,
    }));
  };

  const handleDeactivatedChange = () => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      isActive: false,
    }));
  };

//errors for this
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
//   console.log("Images:", images);
//get productId to pass the product can be edited in the db
const productId = product.id
  //if successful, clear formstate, show error or success
  try {
    
      //get the image url for each image provided by user
      const imageUrls = await Promise.all(
        images.map((image: any) => uploadImage(image))
      );
      //create object that has the formdata and image urls
      const productData = { ...formData, images: imageUrls };

      
      const editResponse = await editProduct(productId, productData);
      //set error/message in state
      console.log(editResponse)
  
  } catch (error) {
    console.log("error editing product");
  }
};

console.log(formData)
return (
  <div className="w-2/3 p-8 mt-10 rounded-lg shadow-md bg-purple-700">
    <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-semibold mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-semibold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-semibold mb-2">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={Number(formData.price)}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-semibold mb-2">
          Type
        </label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="quantity"
          className="block text-sm font-semibold mb-2"
        >
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={Number(formData.quantity)}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="keywords"
          className="block text-sm font-semibold mb-2"
        >
          Keywords (comma-separated)
        </label>
        <input
          type="text"
          id="keywords"
          name="keywords"
          value={formData.keywords.join(",")}
          onChange={handleKeywordsChange}
          className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-semibold mb-2">
          Images (up to 5)
        </label>
        <input
          type="file"
          id="image"
          name="image"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
      
        />
        {imagesError && <p className="text-red-500">{imagesError}</p>}
      </div>
      <div className="mb-4">
          <label htmlFor="isActive" className="block text-sm font-semibold mb-2">
            Status
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleActiveChange}
              className="mr-2 leading-tight"
            />
            <span className="text-sm text-gray-400">Active</span>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="isDeactivated"
              name="isDeactivated"
              checked={!formData.isActive}
              onChange={handleDeactivatedChange}
              className="mr-2 leading-tight"
            />
            <span className="text-sm text-gray-400">Deactivated</span>
          </div>
        </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
      >
       Edit Product
      </button>
    </form>
  </div>
);
};

export default EditForm;
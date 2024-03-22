"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { createProduct } from "@/app/actions";
import { storage } from "@/app/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
interface Product {
  images: string[];
  name: string;
  description: string;
  price: number;
  type: string;
  quantity: number;
  keywords: string[];
}

const AddProductForm: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>({
    images: [],
    name: "",
    description: "",
    price: 0,
    type: "",
    quantity: 0,
    keywords: [],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
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
    console.log("Selected files:", filesArray);
  };

  //must keep in client? in server, it doesn't like that i pass back the urls for some reason, says it doesn't like [File]
const uploadImage = async (image: File): Promise<string> => {
    try {
      console.log("Uploading image:", image);
      //create image name
      const imageName = `${Date.now()}-${image.name}`;
      console.log("Image name:", imageName);
      //referene to the location whree image will be stored.
      const imageRef = ref(storage, `images/${imageName}`);
      console.log("Image reference:", imageRef);
  
      // uploads the file to the place we told it to go
      await uploadBytes(imageRef, image);
  
      //after it uploads, we need to get the url so we can store it with the associated product in firestore
      const imageUrl = await getDownloadURL(imageRef);
      console.log("Image URL:", imageUrl);
  
      return imageUrl;
    } catch (error) {
      throw new Error("Error uploading images");
    }
  };
console.log(images)
  //errors for this
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Images:", images);
    //if successful, clear formstate, show error or success
    try {
      
        //get the image url for each image provided by user
        const imageUrls = await Promise.all(
          images.map((image: any) => uploadImage(image))
        );

        console.log("Uploaded image URLs:", imageUrls);

        //create object that has the formdata and image urls
        const productData = { ...formData, images: imageUrls };

        
        const { error, message } = await createProduct(productData);
        //set error/message in state
    
    } catch (error) {
      console.log("error adding product");
    }
  };

  return (
    <div className="w-2/3 p-8 mt-10 rounded-lg shadow-md bg-slate-500">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
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
            value={formData.price}
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
            value={formData.quantity}
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
            required
          />
          {imagesError && <p className="text-red-500">{imagesError}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;

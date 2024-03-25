"use client";
import React, { useState, useEffect } from "react";

interface Props {
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  images?: string[];
}

const ImageUploader: React.FC<Props> = ({ images, setImages }) => {
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (images) {
      setPreviews(images);
    }
  }, []);

  let emptySlots = 5;
  console.log(previews.length);

  if (previews != undefined) {
    emptySlots = 5 - previews.length;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 5) {
        setError("You can upload up to 5 images.");
      } else {
        setError(null);
        setImages((prevImages) => [...prevImages, ...Array.from(files)]);
        const imagePreviews = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        );
        setPreviews((prevPreviews) => [...prevPreviews, ...imagePreviews]);
      }
    }
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.stopPropagation(); // Prevent form submission
    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };
  console.log(images);
  return (
    <div className="flex">
      {previews.map((imageUrl, index) => (
        <div
          key={index}
          className="relative cursor-pointer m-2 bg-gray-300 w-40 h-60 flex items-center justify-center"
        >
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {previews.length === 1 && (
            <button
              className="absolute top-0 right-0 mt-2 mr-2 text-red-500 text-xs"
              onClick={(e) => handleDelete(e, index)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
      {/* Empty slots */}
      {[...Array(5 - previews.length)].map((_, index) => (
        <label
          key={index}
          htmlFor={`image-${index}`}
          className="relative cursor-pointer m-2 bg-gray-300 w-40 h-60 flex items-center justify-center"
        >
          {previews.length === 0 && (
            <span className="absolute text-gray-500">
              {error ? error : "Add photo"}
            </span>
          )}
          <input
            type="file"
            id={`image-${index}`}
            accept="image/*"
            className="absolute opacity-0 w-full h-full cursor-pointer"
            onChange={handleChange}
            multiple
          />
          {previews[index] && (
            <button
              className="absolute top-0 right-0 mt-2 mr-2 text-red-500 text-xs"
              onClick={(e) => handleDelete(e, index)}
            >
              Delete
            </button>
          )}
        </label>
      ))}
    </div>
  );
};

export default ImageUploader;

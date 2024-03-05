"use client";
import React, { useState, useEffect } from "react";

type ContactInfo = {
  name: string;
  email: string;
  address: string;
};

type CollectInfoProps = {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
};

const CollectInfo = ({
  setContactInfo,
  contactInfo,
}: CollectInfoProps) => {
  const [name, setName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [validatedAddress, setValidatedAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleAddressValidation = async () => {
    const cleanedAddress = userAddress.replace(/,/g, "");
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          cleanedAddress
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.results.length > 0) {
          setValidatedAddress(data.results[0].formatted_address);
        }
      } else {
        console.error("Error validating address:", response.statusText);
      }
    } catch (error) {
      console.error("Error validating address:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //callback so that the value is immediately available
    setUserAddress((prevAddress) => {
      return `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}`;
    });
  };

  const handleSetAddress = () => {
    if (selectedAddress) { 
      setContactInfo({ name: name, email: email, address: selectedAddress });
    } else {
      setContactInfo({name: name, email: email, address: validatedAddress});
    }
  };

  useEffect(() => {
    handleAddressValidation();
  }, [userAddress, validatedAddress, userAddress]);

  useEffect(() => {
    console.log(`contactInfo="${contactInfo.name} ${contactInfo.email} ${contactInfo.address}`);
  }, [ contactInfo]);

  return (
    <div className="w-full bg-cyan-400">
      <form onSubmit={handleSubmit} className="w-1/3 flex flex-col">
        <div className="bg-red-200">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="bg-red-200">
          <label htmlFor="email">email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="bg-red-200">
          <label htmlFor="addressline2">Address Line 1:</label>
          <input
            type="text"
            id="address1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
          />
        </div>
        <div className="bg-red-200">
          <label htmlFor="addressline2">Address Line 2:</label>
          <input
            type="text"
            id="address2"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />
        </div>
        <div className="bg-red-200">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="bg-red-200">
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <div className="bg-red-200">
          <label htmlFor="address">Zipcode:</label>
          <input
            type="text"
            id="zipcode"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-slate-200">
          Submit
        </button>
      </form>
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

      {contactInfo.address && (
        <div>
          <p>Selected Address:</p>
          <p>{contactInfo.address}</p>
        </div>
      )}

    </div>
  );
};

export default CollectInfo;

"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/app/components/CartContext";
import ValidateShipping from "./ValidateShipping";

type CollectInfoProps = {
  handleAddressValidation: any;
};

const CollectInfo = ({ handleAddressValidation }: CollectInfoProps) => {
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

  const { state: globalState, dispatch } = useCart();
  const { contactInfo } = globalState;
  //   console.log(contactInfo)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //dispatching to global state, name, email, address once available. maybe set name and email here.
    //callback so that the value is immediately available
    setUserAddress((prevAddress) => {
      let address2 = addressLine2 ? `${addressLine2},` : "";
      return `${addressLine1}, ${address2} ${city}, ${state} ${zip}`;
    });
  };

  const handleSetAddress = () => {
    if (selectedAddress) {
      //set global state with address here
      dispatch({
        type: "UPDATE_INFO",
        payload: { name: name, email: email, address: selectedAddress },
      });
    } else {
      dispatch({
        type: "UPDATE_INFO",
        payload: { name: name, email: email, address: validatedAddress },
      });
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const returnedAddress = await handleAddressValidation(userAddress);
      setValidatedAddress(returnedAddress);
    };

    fetchAddress();
  }, [userAddress]);


  return (
    <>
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
      </div>
      <ValidateShipping
        handleSetAddress={handleSetAddress}
        userAddress={userAddress}
        validatedAddress={validatedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    </>
  );
};

export default CollectInfo;

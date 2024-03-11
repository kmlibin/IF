"use client";
import React, { useState, useEffect } from "react";

import { useCart } from "@/app/components/CartContext";

type ChooseShippingProps = {
  setShipping: any;
};

const displayAddress = (address: string) => {
  const parts = address.split(",").map((part) => part.trim());
  const lines = [];

  // first line always is address line 1, so always push it as its won string
  lines.push(parts.shift() || "");

  // handle address line 2 separately if it exists
  if (parts[0] && isAddressLine2(parts[0])) {
    lines.push(parts.shift() || "");
  }

  // make sure the last 3-4 parts (city, state, zip, country) are together
  const lastLine = parts.slice(-3).join(", ");
  lines.push(lastLine);

  return lines;
};

//check if addressline2 is present
const isAddressLine2 = (part: string) => {
  const commonKeywords = ["apt", "unit", "#", "suite"];
  const lowerCasePart = part.toLowerCase();
  return commonKeywords.some((keyword) => lowerCasePart.startsWith(keyword));
};

const calculateShipping = (subtotal: number, countryCode: string) => {
  let country = countryCode;
  let rates = {};
  if (!country) {
    country = "USA";
  }
  //if subtotal is less than $16, regular shipping is $4, priority is $7
  //if subtotal is between $16 - $50, reg shipping is now priority, which is $7
  //if subtotal is over 50, shipping is 0

  if (subtotal <= 16) {
    rates = { standard: 4, priority: 7, free: false };
  }

  if (subtotal > 16 && subtotal < 50) {
    rates = { standard: undefined, priority: 10, free: false };
  }

  if (subtotal >= 50) {
    rates = { standard: undefined, priority: undefined, free: true };
  }

  return rates;
};

type ShippingRates = {
  standard?: number |undefined;
  priority?: number | undefined;
  free?: boolean | undefined;
};

const ChooseShipping = ({ setShipping }: ChooseShippingProps) => {
  const [shippingRates, setShippingRates] = useState<ShippingRates>({standard: undefined, priority: undefined, free: false});
  const { state } = useCart();
  const { subtotal } = state;
  const { contactInfo } = state;

  useEffect(() => {
    const rates = calculateShipping(subtotal, "USA");
    setShippingRates(rates);
    if (shippingRates.free === true) {
      setShipping(0);
    }
  }, [subtotal]);

  const formattedAddress = displayAddress(contactInfo.address);

  const handleShippingSelect = (rate: number | undefined) => {
    if(typeof rate !== "undefined") {
      setShipping(rate);
    }
    
  };

  
  return (
    <div className="flex">
      <div className="w-1/3 flex flex-col">
        <p>{contactInfo.name}</p>
        {formattedAddress.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="w-2/3 flex flex-col">
        <p>Choose Shipping:</p>
        {shippingRates && shippingRates.free === true && (
            <label>
            <input
              type="radio"
              name="shippingOption"
              value="0"
              onChange={() => handleShippingSelect(0)}
            />
            This order qualifies for free shipping! 0.00
          </label>
        )}
        {shippingRates && typeof shippingRates.priority !== 'undefined' && (
          <label>
            <input
              type="radio"
              name="shippingOption"
              value={shippingRates.priority}
              onChange={() => handleShippingSelect(shippingRates.priority)}
            />
            Priority Shipping: {shippingRates.priority}
          </label>
        )}
        {shippingRates && typeof shippingRates.standard !== 'undefined' && (
          <label>
            <input
              type="radio"
              name="shippingOption"
              value={shippingRates.standard}
              onChange={() => handleShippingSelect(shippingRates.standard)}
            />
            Standard Shipping: {shippingRates.standard}
          </label>
        )}
      </div>
    </div>
  );
};

export default ChooseShipping;

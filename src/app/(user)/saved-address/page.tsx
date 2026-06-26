"use client";

import React, { useEffect, useState } from 'react';
import SavedAddress from './SavedAddress';
import { globalServerRequest } from '@/actions/globalApi';

const page = () => {

  const [addressData, setAddressData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await globalServerRequest({
          endpoint: "profile/address",
          method: "GET",
        });

        if (response.success) {
          const data = response?.data?.data || response?.data;
          setAddressData(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.log("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div>
      <SavedAddress addressData={addressData} />
    </div>
  );
};

export default page;

import React, { useState, useEffect, useContext } from 'react';
import { Router } from 'next/router';

import { SideBar, Navbar, DisplayCampaigns } from '../components';
import { CampaignContext } from '../context/campaignContext';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { getUserCampaigns, currentAccount } = useContext(CampaignContext);

  // const fetchCampaigns = async () => {
  //   setIsLoading(true);
  //   const data = await getUserCampaigns();
  //   setCampaigns(data);
  //   setIsLoading(false);
  // };

  useEffect(() => {
    getUserCampaigns().then((item) => {
      setCampaigns(item);
      setIsLoading(false);
    });
  }, [currentAccount]);

  return (
    <>
      <div className="text-white">
        <DisplayCampaigns
          title="All Campaigns"
          isLoading={isLoading}
          campaigns={campaigns}
        />
      </div>
    </>
  );
}

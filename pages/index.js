import React, { useState, useEffect, useContext } from 'react';
import { Router } from 'next/router';

import { SideBar, Navbar, DisplayCampaigns, Loading } from '../components';
import { CampaignContext } from '../context/campaignContext';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const { getCampaigns } = useContext(CampaignContext);

  // const fetchCampaigns = async () => {
  //   setIsLoading(true);
  //   const data = await getCampaigns();
  //   console.log({ data });
  //   setCampaigns(data);
  //   setIsLoading(false);
  // };

  useEffect(() => {
    // fetchCampaigns();
    getCampaigns().then((items) => {
      setCampaigns(items);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <div className="text-white">
        {isLoading && <Loading type="loading" />}
        <DisplayCampaigns
          title="All Campaigns"
          isLoading={isLoading}
          campaigns={campaigns}
        />
      </div>
    </>
  );
}

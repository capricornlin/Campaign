import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { loader } from '../assets';
import { CampaignCards } from './';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const router = useRouter();

  const handleNavigate = (campaign) => {
    //QUES:router push可以傳送object，但是必須先stringify
    router.push({
      pathname: `/campaign-details/${campaign.pId}`,
      query: { data: JSON.stringify(campaign) },
    });
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaigns.length})
      </h1>
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && <Image src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />}
        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet
          </p>
        )}
        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <CampaignCards key={campaign.pId} {...campaign} handleClick={() => handleNavigate(campaign)} />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;

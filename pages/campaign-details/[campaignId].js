import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Image from 'next/image';

import {
  CampaignContext,
  isLoadingCampaign,
} from '../../context/campaignContext';
import { Button, CountBox, Loading } from '../../components';
import { calculateBarPercentage, daysLeft } from '../../utils';

const campaignId = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [remainDays, setRemainDays] = useState(0);
  const [donators, setDonators] = useState([]);
  const [amount, setAmount] = useState(0);

  // const remainingDays = daysLeft(campaign.deadline);

  // const { campaignId } = router.query;
  // console.log({ campaignId });
  const {
    currentAccount,
    donate,
    getAllDonations,
    getCampaigns,
    isLoadingCampaign,
  } = useContext(CampaignContext);
  const [campaign, setCampaign] = useState({
    owner: '',
    title: '',
    description: '',
    image: '',
    pId: '',
    target: '',
    deadline: '',
    amountCollected: '',
  });

  //NOTE:: 要抓到router傳送過來的object，必須搭配router.isReady
  //QUES:如果換帳號怎麼辦
  useEffect(() => {
    if (!router.isReady) return;
    const { data } = router.query;
    const parsedata = JSON.parse(data);
    console.log({ parsedata });
    setCampaign(parsedata);
    setRemainDays(daysLeft(parsedata.deadline));
    setIsLoading(false);
  }, [router.isReady]);

  //BUG:=============================這邊搞超級久！！！！==================================
  //BUG: 會有useEffect的loading問題！！！！！！
  useEffect(() => {
    if (!isLoading) fetchDonators();
  }, [campaign]);

  const fetchDonators = async () => {
    //>Pid = string
    const data = await getAllDonations(campaign.pId);
    setDonators(data);
  };

  const handleDonate = async () => {
    await donate(campaign.pId, amount);
  };

  return (
    <div>
      {isLoadingCampaign && <Loading type="Transaction" />}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col relative ">
          <div className="w-full h-[410px] object-cover">
            <Image
              src={campaign.image}
              alt="campaign"
              layout="fill"
              objectFit="cover"
              unoptimized
              className="rounded-2xl"
            />
          </div>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  campaign.target,
                  campaign.amountCollected
                )}%`,
                maxWidth: '100%',
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainDays} />
          <CountBox
            title={`Rasied of ${campaign.target}`}
            value={campaign.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[10px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase">
              Creator
            </h4>

            <div className="mt-[5px] flex flex-col justify-start gap-[14px] ">
              <h4 className="font-epilpgue font-semibold text-[14px] text-[#808191] break-all">
                {campaign.owner}
              </h4>
              {/* <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                10 Campaigns
              </p> */}
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase">
              Story
            </h4>
            <p className="mt-[4px] font-epilogue font-normal text-[16px] leading-[26px] text-justify text-[#808191] ">
              {campaign.description}
            </p>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase">
              Donators
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {/* //>here  */}
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4 "
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="mt-[4px] font-epilogue font-normal text-[16px] leading-[26px] text-justify text-[#808191] ">
                  No donators yet. Be the first one.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase">
            Fund
          </h4>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191] ">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
              />
              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white ">
                  Back it because you believe in it
                </h4>
              </div>
              <Button
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default campaignId;

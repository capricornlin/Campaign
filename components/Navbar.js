import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Button } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../context/constant';
import { CampaignContext } from '../context/campaignContext';

const Navbar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { ConnectWallet, currentAccount } = useContext(CampaignContext);

  // const address = '0xabc...';
  // const address = '';

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6 ">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
          type="text"
          placeholder="Search for campaigns"
        />
        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <Image src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
        </div>
      </div>
      <div className="sm:flex hidden flex-row justify-end gap-4 ">
        {currentAccount ? (
          <Button
            btnType="button"
            title={'Create a campaign'}
            styles={'bg-[#1dc071]'}
            handleClick={() => {
              router.push('/create-campaign');
            }}
          />
        ) : (
          <Button btnType="button" title={'connect'} style={'bg-[#8c6dfd]'} handleClick={ConnectWallet} />
        )}
        {/* <Button
          btnType="button"
          title={address ? 'Create a campaign' : 'connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handlClick={() => {
            if (address) {
              router.push('/create-campaign');
            } else {
              // connect();
            }
          }}
        /> */}
        <Link href="/profile">
          <div
            className="w-[52px] h-[52px] rounded-full 
          bg-[#2c2f32] flex justify-center items-center cursor-pointer"
          >
            <Image src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>
      </div>

      {/* NOTE: ---------------------------small screen------------------------------- */}

      <div className="sm:hidden flex justify-between items-center relative">
        <div
          className="w-[40px] h-[40px] rounded-[10px] 
          bg-[#2c2f32] flex justify-center items-center cursor-pointer"
        >
          <Image src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
        </div>
        <Image
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />
        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  router.push(link.link);
                }}
              >
                <Image
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                  src={link.imgUrl}
                  alt={link.name}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            {currentAccount ? (
              <Button
                btnType="button"
                title={'Create a campaign'}
                styles={'bg-[#1dc071]'}
                handleClick={() => {
                  router.push('/create-campaign');
                }}
              />
            ) : (
              <Button btnType="button" title={'connect'} style={'bg-[#8c6dfd]'} handleClick={ConnectWallet} />
            )}
            {/* <Button
              btnType="button"
              title={address ? 'Create a campaign' : 'connect'}
              styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
              handleClick={() => {
                if (address) {
                  router.push('/create-campaign');
                } else {
                  //NOTE:connect wallet
                  ConnectWallet;
                }
              }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

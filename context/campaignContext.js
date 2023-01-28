import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';

import { kickstarterAddress, kickstarterABI } from './constant';

const fetchContract = (signerOrProvider) => {
  //   console.log('fetch the contract successfully');
  return new ethers.Contract(
    kickstarterAddress,
    kickstarterABI,
    signerOrProvider
  );
};

export const CampaignContext = createContext();

//NOTE: CampaignContext就是把contract連結起來變成function，然後讓全部的頁面都可以使用這些function
export const CampaignProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  const router = useRouter();

  const NFTcurrency = 'ETH';

  const CheckIfWallerIsConnected = async () => {
    if (!window.ethereum) return alert('Please install Metamask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      console.log('CurrentAccount', accounts[0]);
    } else {
      console.log('No Account Found!');
    }
  };

  const checkIfAccountChanged = async () => {
    try {
      const { ethereum } = window;
      ethereum.on('accountsChanged', (accounts) => {
        console.log('Account changed to:', accounts[0]);
        setCurrentAccount(accounts[0]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //NOTE: 這邊代表每次使用useContext的時候，都會先經過這個useEffect()
  useEffect(() => {
    CheckIfWallerIsConnected();
    checkIfAccountChanged();
  }, []);

  const ConnectWallet = async () => {
    if (!window.ethereum) return alert('Please install Metamask');
    // console.log('try to connect account');

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  //>發起campaign
  const publishCampaign = async (form) => {
    // console.log({ form });
    // const form = inputform;
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = fetchContract(signer);
      // console.log({ contract });
      // console.log({ currentAccount });
      const data = await contract.createCampaign(
        // currentAccount,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image
      );
      //>createCampaign會改變blockchain上面儲存的值
      setIsLoadingCampaign(true);
      await data.wait();
      // setIsLoadingCampaign(false);
      // console.log({ data });
      router.push('/');
    } catch (error) {
      console.log({ error });
    }
  };

  //>得到所有的campaigns
  const getCampaigns = async () => {
    setIsLoadingCampaign(false);
    // const provider = new ethers.providers.JsonRpcProvider();
    const provider = new ethers.providers.JsonRpcProvider(
      'https://goerli.infura.io/v3/4a336c45a610447ebcc52981cd8e43c3'
    );
    const contract = fetchContract(provider);
    const data = await contract.getCampaigns();

    //NOTE: =>({ }) 代表直接return一個object
    const parsedCampaigns = await Promise.all(
      data.map((campaign, index) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: index,
      }))
    );

    // console.log({ parsedCampaigns });
    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    setIsLoadingCampaign(false);
    const allCampaigns = await getCampaigns();
    // BUG : owner address要換成小寫
    const filterCampaigns = await Promise.all(
      allCampaigns.filter(
        (campaign) => campaign.owner.toLowerCase() === currentAccount
      )
    );
    // console.log({ currentAccount });
    return filterCampaigns;
  };

  const donate = async (pId, amount) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    //const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const price = ethers.utils.parseUnits(amount.toString(), 'ether');
    // const parseAmount = ethers.utils.parseEther(amount);
    //> transaction : We don’t get the value back, we get the transaction hash back.
    const transaction = await contract.donateToCampaign(pId, {
      value: price,
    });
    setIsLoadingCampaign(true);
    await transaction.wait();
    // setIsLoadingCampaign(false);
    router.push('/');
    return transaction;
  };
  //>改成return a Promise
  const getAllDonations = async (pId) => {
    setIsLoadingCampaign(false);
    // const provider = new ethers.providers.JsonRpcProvider();
    const provider = new ethers.providers.JsonRpcProvider(
      'https://goerli.infura.io/v3/4a336c45a610447ebcc52981cd8e43c3'
    );
    const contract = fetchContract(provider);
    const parsedDonations = [];
    //>donations is a Promise
    const donations = await contract.getDonators(pId);
    // const Alldonator = Promise.all()
    const numberOfDonations = donations[0].length;
    console.log({ donations });

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    // return await Promise.all(parsedDonations);
    return parsedDonations;
  };

  return (
    <CampaignContext.Provider
      value={{
        ConnectWallet,
        currentAccount,
        publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getAllDonations,
        isLoadingCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

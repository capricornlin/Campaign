import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Image from 'next/image';

import { money } from '../assets';
import { Button, FormField, Loading } from '../components';
import { checkIfImage } from '../utils';
import { CampaignContext } from '../context/campaignContext';

const CreateCampaign = () => {
  const router = useRouter();
  const { publishCampaign, isLoadingCampaign } = useContext(CampaignContext);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    deadline: '',
    image: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkIfImage(form.image, async (exists) => {
      if (exists) {
        //> setIsLoading(true);
        await publishCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        //> setIsLoading(false);
        // router.push('/');
      } else {
        alert('Provide valid image URL');
        setForm({ ...form, image: '' });
      }
    });
    console.log(form);
  };
  //QUES: useState with object
  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  return (
    <div className="bg-[#1c1c24] flex items-center justify-center flex-col rounded-[10px] sm:p-10 p-4">
      {/* //> */}
      {isLoadingCampaign && <Loading type="Transaction" />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px]
      flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            LabelName="Your Name"
            placeholder="Casey lin"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            LabelName="Campaign Title"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>
        <FormField
          LabelName="Story"
          placeholder="Write your story"
          textArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />
        <div
          className="w-full flex justify-start items-center
        p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]"
        >
          <Image
            src={money}
            alt="money"
            className="w-[40px]
          h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px] ">
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            LabelName="Goal"
            placeholder="ETH 0.5"
            inputType="text"
            value={form.target || ''}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField
            LabelName="End Date"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>
        <FormField
          LabelName="Campaign Image"
          placeholder="Place image URL of the campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />
        <div className="flex justify-center items-center mt-[40px]">
          <Button
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;

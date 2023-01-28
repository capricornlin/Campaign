// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "hardhat/console.sol";

contract kickstarter {
    struct Campaign{
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image; //>url
        address[] donators;
        uint256[] donations;

    }
    
    //>map campaign pId
    mapping(uint256 => Campaign) public campaigns;
    //>number of campaigns
    uint256 public numberOfCampaigns = 0;

    //>return ID of the campaign
    function createCampaign(string memory _title,string memory _description,uint256 _target,uint256 _deadline,string memory _image) public returns(uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        //> check deadline
        require(campaign.deadline < block.timestamp,'The deadline should be a data in the future');
        // console.log('we are in create campaign');
        //BUG:這邊的msg.sender會是contract address 
        campaign.owner = msg.sender;
        // campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        
        numberOfCampaigns++;
        
        //>index of campaign
        return numberOfCampaigns-1;
        

    }

    //>donate to which id of campaign
    function donateToCampaign(uint256 _id) public payable{
        // uint256 amount = msg.value;

        //>get the specific id of campaign
        Campaign storage campaign = campaigns[_id];

        //> puch the donator address to specific id of campaign in donators index
        campaign.donators.push(msg.sender);

        campaign.donations.push(msg.value);

        //> call 會回覆兩個東西，但我們只需要一個，所以加上一個 ,
        //> call和transfer都是傳送ether的function，只不過transfer只會送過去2300gas給對方去執行
        // (bool sent,) = payable(campaign.owner).call{value:msg.value}("");
        payable(campaign.owner).transfer(msg.value);
        
        // if(sent){
            campaign.amountCollected = campaign.amountCollected+msg.value;
        // }

    }

    //>所有donators
    // function getDonators(uint256 _id) view public returns(address[] memory,uint256[] memory){
        
    //     return (campaigns[_id].donators,campaigns[_id].donations);
    // }
     function getDonators(uint256 _id) view public returns(address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    //>所有的campaigns
    function getCampaigns() public view returns(Campaign[] memory){
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns ;i++){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

}

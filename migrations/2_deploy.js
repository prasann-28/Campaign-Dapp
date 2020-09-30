const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");
module.exports = function (deployer, network, accounts) {
  deployer.deploy(CampaignFactory);
};

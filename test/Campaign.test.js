const CampaignFactory = artifacts.require('CampaignFactory')
const Campaign = artifacts.require('Campaign')

contract("CampaignFactory", () => {
    let factory
    let campaign
    let campaignAddress
    let accounts

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();
        factory = await CampaignFactory.deployed({from: accounts[0], gas: '1000000'});
        
        await factory.createCampaign('100',{from: accounts[0], gas: '1000000'});
        

        const addresses = await factory.getDeployedCampaigns()
        campaignAddress = addresses[0]
        campaign = await Campaign.deployed()

    });

    it('deploys a factory', () =>{
        assert.ok(factory.address)
        assert.ok(campaign.address)    
    })
        

    it('deploys a campaign',() => {
    assert.notEqual(factory.address,campaign.address)
    })
})
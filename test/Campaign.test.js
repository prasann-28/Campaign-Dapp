const CampaignFactory = artifacts.require('CampaignFactory')
const Campaign = artifacts.require('Campaign')

contract("CampaignFactory", () => {
    let factory
    let campaign
    let campaignAddress
    let accounts

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();
        factory = await CampaignFactory.deployed({from: accounts[0],gas: '1000000'});
        
        await factory.createCampaign('100',{from: accounts[0], gas: '1000000'});
        

        const addresses = await factory.getDeployedCampaigns()
        campaignAddress = addresses[0]
        campaign = await Campaign.new('100', accounts[0])

    });

    it('deploys a factory', () =>{
        assert.ok(factory.address)
        assert.ok(campaign.address)    
    })
        

    it('deploys a campaign',() => {
    assert.notEqual(factory.address,campaign.address)
    })

    contract("Campaign", () =>{


        it('marks caller as campaign manager', async () => {
            const manager = await campaign.manager({from: accounts[0]})
            await assert.equal(accounts[0], manager) 
                //console.log(await campaign.manager())
                //console.log(manager)
            })
        
        it('people are able to donate money to contract/campaign', async () =>{
             await campaign.contribute({value: 200,from: accounts[1], })
             let isContributor = await campaign.approvers(accounts[1])
        
             assert(isContributor);
                 
        })
        
        it('requires a minimum contribution', async ()=>{
            try{
                await campaign.contribute({value:'5', from: accounts[1]})
                assert(false)
            }
            catch (err) {
                assert(err)
            }
            
            })
        
        it('allows the manager to make a payment request', async () => {
            await campaign.createRequest('Buy shirts', '100', accounts[1],{from: accounts[0]})
            const request = await campaign.requests(0)
            assert.equal('100', request.value )
        })


        it('processes requests', async () =>{
            await campaign.contribute({from: accounts[0], value: web3.utils.toWei('10', 'ether')})
            await campaign.createRequest('a', web3.utils.toWei('5','ether'), accounts[1], {from: accounts[0]})

            await campaign.approveRequest(0, {from: accounts[0]})
            await campaign.finalizeRequest(0,{from: accounts[0]})

            let balance = await web3.eth.getBalance(accounts[1])
            balance = web3.utils.fromWei(balance, 'ether')
            balance = parseFloat(balance)
            console.log(balance)
            assert(balance > 103) 
        
        })

        
            
    })
})
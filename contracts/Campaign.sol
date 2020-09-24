pragma solidity 0.5.16;

contract Campaign{
    // Request defined but not implemented
    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    uint public minimumContribution;
    address public manager;
    //address payable[] public approvers; -> if it grows too much gas cost will make you broke in a single for loop
    //address payable[] public vendors;
    // instead use mapping as it is like a basic key->vaue pair
    // keys are not stored in mapping. It is a classic hash table 
    // In mapping you cannot fetch value only references using keys.
    //You cannot iterate through a mapping
    //mapping(key => value) public var_name
    mapping(address => bool) public approvers; 
    uint public approversCount;

    modifier restricted (){
       require(msg.sender == manager); 
        _;
    }

    //constructor sets manager and defines minimum contribution
    constructor() public {
        manager = msg.sender;
        minimumContribution = 0.1 ether;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory _description, uint  _value, address payable _recipient) public restricted {
        //ref_to_struct  _var_name_ = _creates_a_new_instance_of_struct_like_a_constructor 
        //require(approvers[msg.sender]);
        // memory cause each request is new and doesnt need to refer to a copy present in storage
        Request memory newRequest = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false,
            approvalCount: 0
            //No need to add code for mapping/reference types
            //why arrays are not used => searching costs gas
        });

        //storage vs memory 
        //Storage holds data between function calls | like -> ROM
        // memory -> temporary place to store data| like e-> RAM
        // if we call a func to modify data then if storage used then that modified data is available on next func call

        requests.push(newRequest);

    }

    function approveRequest(uint _index) public {
       Request storage request = requests[_index];

        require(approvers[msg.sender] = true);
        require(!requests[_index].approvals[msg.sender]);// checks if sender has not already approved

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint _index) public restricted {
        Request storage request = requests[_index];
        //storage cause to look at same copy of request that already exists inside the storage
        require(request.approvalCount > (approversCount / 2 ));
        //require(requests[_index].complete);
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        requests[_index].complete = true;
    }
    
       

}
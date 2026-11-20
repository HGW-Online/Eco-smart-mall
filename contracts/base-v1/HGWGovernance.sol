// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
interface IHGWUtility { function mint(address to, uint256 amount) external; }
contract HGWGovernance {
    mapping(address => bool) public member;
    uint256 public immutable memberCount;
    uint256 public immutable maxMintPerProposal;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant DELAY = 2 days;
    address public immutable initializer;
    IHGWUtility public utility;
    uint256 public proposalCount;
    struct Proposal { address recipient; uint256 amount; bytes32 evidence; uint256 deadline; uint256 yes; bool executed; }
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public voted;
    event Proposed(uint256 indexed id,address indexed recipient,uint256 amount,bytes32 evidence,uint256 deadline);
    event Voted(uint256 indexed id,address indexed voter);
    event Executed(uint256 indexed id);
    constructor(address[] memory voters,uint256 limit) {
        require(voters.length >= 4 && limit > 0,"invalid configuration");
        initializer=msg.sender;
        memberCount=voters.length;
        maxMintPerProposal=limit;
        for(uint256 i;i<voters.length;i++){
            require(voters[i]!=address(0)&&!member[voters[i]],"invalid member");
            member[voters[i]]=true;
        }
    }
    function bindUtility(address token) external {
        require(msg.sender==initializer && address(utility)==address(0) && token.code.length>0,"binding denied");
        utility=IHGWUtility(token);
    }
    function propose(address recipient,uint256 amount,bytes32 evidence) external returns(uint256 id){
        require(member[msg.sender] && address(utility)!=address(0),"not eligible");
        require(recipient!=address(0)&&amount>0&&amount<=maxMintPerProposal&&evidence!=bytes32(0),"invalid proposal");
        id=++proposalCount;
        uint256 deadline=block.timestamp+VOTING_PERIOD;
        proposals[id]=Proposal(recipient,amount,evidence,deadline,0,false);
        emit Proposed(id,recipient,amount,evidence,deadline);
    }
    function voteYes(uint256 id) external {
        Proposal storage p=proposals[id];
        require(member[msg.sender]&&p.deadline!=0&&block.timestamp<p.deadline&&!voted[id][msg.sender],"vote denied");
        voted[id][msg.sender]=true;
        p.yes++;
        emit Voted(id,msg.sender);
    }
    function execute(uint256 id) external {
        Proposal storage p=proposals[id];
        require(p.deadline!=0&&!p.executed&&block.timestamp>=p.deadline+DELAY,"execution denied");
        require(p.yes>memberCount*3/4,"threshold not reached");
        p.executed=true;
        utility.mint(p.recipient,p.amount);
        emit Executed(id);
    }
}

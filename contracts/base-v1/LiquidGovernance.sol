// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
interface ILiquidUtility { function mint(address,uint256) external; function governance() external view returns(address); }
/// Review candidate: per-proposal one-hop delegation, revocable until deadline.
contract LiquidGovernance {
    enum Kind { Mint, AddMember, RemoveMember }
    struct Proposal { Kind kind; address target; uint256 amount; bytes32 evidence; uint64 deadline; uint64 epoch; uint32 electorate; bool executed; }
    uint256 public constant VOTING_PERIOD=7 days;
    uint256 public constant DELAY=2 days;
    uint256 public constant MAX_EXECUTION_AGE=30 days;
    uint256 public constant MAX_MEMBERS=200;
    uint256 public immutable maxMintPerProposal;
    address public immutable initializer;
    ILiquidUtility public utility;
    uint64 public epoch=1;
    uint256 public proposalCount;
    address[] private roster;
    mapping(address=>bool) public member;
    mapping(uint256=>Proposal) public proposals;
    // Each proposal counts each original member exactly once. Direct ballot overrides delegation.
    mapping(uint256=>mapping(address=>uint8)) public ballot;
    mapping(uint256=>mapping(address=>address)) public delegate;
    event Proposed(uint256 indexed id,Kind kind,address indexed target,uint256 amount,bytes32 evidence);
    event Ballot(uint256 indexed id,address indexed voter,uint8 choice,address representative);
    event Executed(uint256 indexed id);
    constructor(address[] memory initialMembers,uint256 limit){
        require(initialMembers.length>=4&&initialMembers.length<=MAX_MEMBERS&&limit>0,"configuration");
        initializer=msg.sender; maxMintPerProposal=limit;
        for(uint256 i;i<initialMembers.length;i++){
            address v=initialMembers[i]; require(v!=address(0)&&!member[v],"member");
            member[v]=true; roster.push(v);
        }
    }
    function memberCount() external view returns(uint256){return roster.length;}
    function bindUtility(address token) external {
        require(msg.sender==initializer&&address(utility)==address(0)&&token.code.length>0,"binding");
        require(ILiquidUtility(token).governance()==address(this),"wrong governor");
        utility=ILiquidUtility(token);
    }
    function propose(Kind kind,address target,uint256 amount,bytes32 evidence) external returns(uint256 id){
        require(member[msg.sender]&&target!=address(0)&&evidence!=bytes32(0),"proposal");
        if(kind==Kind.Mint) require(address(utility)!=address(0)&&amount>0&&amount<=maxMintPerProposal,"mint");
        else {
            require(amount==0,"amount");
            if(kind==Kind.AddMember) require(!member[target]&&roster.length<MAX_MEMBERS,"add");
            else require(member[target]&&roster.length>4,"remove");
        }
        id=++proposalCount;
        proposals[id]=Proposal(kind,target,amount,evidence,uint64(block.timestamp+VOTING_PERIOD),epoch,uint32(roster.length),false);
        emit Proposed(id,kind,target,amount,evidence);
    }
    function _open(uint256 id) private view {
        Proposal storage p=proposals[id];
        require(member[msg.sender]&&p.epoch==epoch&&block.timestamp<p.deadline&&!p.executed,"closed");
    }
    // 0 abstain/revoke; 1 yes; 2 no. Direct voting clears delegation.
    function vote(uint256 id,uint8 choice) external {
        _open(id); require(choice<=2,"choice");
        ballot[id][msg.sender]=choice; delete delegate[id][msg.sender];
        emit Ballot(id,msg.sender,choice,address(0));
    }
    function delegateVote(uint256 id,address representative) external {
        _open(id); require(member[representative]&&representative!=msg.sender,"delegate");
        delete ballot[id][msg.sender]; delegate[id][msg.sender]=representative;
        emit Ballot(id,msg.sender,0,representative);
    }
    function tally(uint256 id) public view returns(uint256 yes,uint256 no){
        require(proposals[id].epoch==epoch,"stale");
        for(uint256 i;i<roster.length;i++){
            address v=roster[i]; uint8 b=ballot[id][v];
            address d=delegate[id][v];
            if(b==0&&d!=address(0)) b=ballot[id][d];
            if(b==1) yes++; else if(b==2) no++;
        }
    }
    function execute(uint256 id) external {
        Proposal storage p=proposals[id];
        require(p.epoch==epoch&&!p.executed&&block.timestamp>=uint256(p.deadline)+DELAY&&block.timestamp<=uint256(p.deadline)+MAX_EXECUTION_AGE,"execution");
        (uint256 yes,)=tally(id); require(yes*4>uint256(p.electorate)*3,"threshold");
        p.executed=true;
        if(p.kind==Kind.Mint) utility.mint(p.target,p.amount);
        else {
            if(p.kind==Kind.AddMember){require(!member[p.target]&&roster.length<MAX_MEMBERS,"add");member[p.target]=true;roster.push(p.target);}
            else {require(member[p.target]&&roster.length>4,"remove");member[p.target]=false;
                for(uint256 i;i<roster.length;i++) if(roster[i]==p.target){roster[i]=roster[roster.length-1];roster.pop();break;}
            }
            epoch++;
        }
        emit Executed(id);
    }
}

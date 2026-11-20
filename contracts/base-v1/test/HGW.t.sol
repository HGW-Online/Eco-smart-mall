// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import "forge-std/Test.sol";
import "../HGWUtility.sol";
import "../HGWGovernance.sol";
import "../HGWAssets.sol";
contract HGWTest is Test {
    HGWGovernance g; HGWUtility t; HGWAssets a;
    address treasury=address(100);
    function setUp() public {
        address[] memory v=new address[](4);
        for(uint i;i<4;i++) v[i]=address(i+10);
        g=new HGWGovernance(v,100 ether);
        t=new HGWUtility(treasury,address(g));
        g.bindUtility(address(t)); a=new HGWAssets();
    }
    function propose() internal returns(uint id){
        vm.prank(address(10)); id=g.propose(treasury,10 ether,keccak256("test evidence"));
    }
    function vote(uint id,uint n) internal {
        for(uint i;i<n;i++){vm.prank(address(i+10));g.voteYes(id);}
    }
    function testInitialSupply() public view {
        assertEq(t.totalSupply(),1_000_000_000 ether);
        assertEq(t.balanceOf(treasury),t.totalSupply());
        assertEq(t.symbol(),"HGw"); assertEq(t.decimals(),18);
    }
    function testDirectMintFails() public {
        vm.expectRevert(HGWUtility.Unauthorized.selector);t.mint(treasury,1);
    }
    function testExactly75PercentFails() public {
        uint id=propose();vote(id,3);vm.warp(block.timestamp+9 days);
        vm.expectRevert(bytes("threshold not reached"));g.execute(id);
    }
    function testAbove75PercentAndReplay() public {
        uint id=propose();vote(id,4);vm.warp(block.timestamp+9 days);
        g.execute(id);assertEq(t.totalSupply(),1_000_000_010 ether);
        vm.expectRevert(bytes("execution denied"));g.execute(id);
    }
    function testDuplicateVoteFails() public {
        uint id=propose();vote(id,1);vm.prank(address(10));
        vm.expectRevert(bytes("vote denied"));g.voteYes(id);
    }
    function testEarlyExecutionFails() public {
        uint id=propose();vote(id,4);
        vm.expectRevert(bytes("execution denied"));g.execute(id);
    }
    function testAssetsDisabled() public view {
        assertFalse(a.issuanceEnabled());assertFalse(a.transferEnabled());
    }
    function testTokenHolderCannotVote() public {
        uint id=propose();vm.prank(treasury);
        vm.expectRevert(bytes("vote denied"));g.voteYes(id);
    }
    function testFuzzMintLimit(uint amount) public {
        vm.assume(amount>100 ether);vm.prank(address(10));
        vm.expectRevert(bytes("invalid proposal"));g.propose(treasury,amount,keccak256("evidence"));
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import "forge-std/Test.sol";
import "../LiquidGovernance.sol";
import "../HGWUtility.sol";
contract LiquidTest is Test {
    LiquidGovernance g; HGWUtility t;
    function setUp() public {
        address[] memory v=new address[](4);
        for(uint i;i<4;i++) v[i]=address(i+10);
        g=new LiquidGovernance(v,100 ether);
        t=new HGWUtility(address(100),address(g)); g.bindUtility(address(t));
    }
    function proposal() internal returns(uint id){
        vm.prank(address(10)); id=g.propose(LiquidGovernance.Kind.Mint,address(100),10 ether,keccak256("evidence"));
    }
    function yes(uint id,address v) internal {vm.prank(v);g.vote(id,1);}
    function testDelegationAndRevocation() public {
        uint id=proposal();yes(id,address(10));
        vm.prank(address(11));g.delegateVote(id,address(10));
        (uint y,)=g.tally(id);assertEq(y,2);
        vm.prank(address(11));g.vote(id,2);
        (y,)=g.tally(id);assertEq(y,1);
    }
    function testThreshold() public {
        uint id=proposal();for(uint i;i<3;i++)yes(id,address(i+10));
        vm.warp(block.timestamp+9 days);
        vm.expectRevert(bytes("threshold"));g.execute(id);
    }
    function testMemberChangeInvalidatesOldProposals() public {
        uint old=proposal();vm.prank(address(10));
        uint id=g.propose(LiquidGovernance.Kind.AddMember,address(20),0,keccak256("membership"));
        for(uint i;i<4;i++)yes(id,address(i+10));
        vm.warp(block.timestamp+9 days);g.execute(id);assertTrue(g.member(address(20)));
        vm.expectRevert(bytes("execution"));g.execute(old);
    }
    function testDelegatedMint() public {
        uint id=proposal();yes(id,address(10));yes(id,address(12));yes(id,address(13));
        vm.prank(address(11));g.delegateVote(id,address(10));
        vm.warp(block.timestamp+9 days);g.execute(id);
        assertEq(t.totalSupply(),1_000_000_010 ether);
    }
}

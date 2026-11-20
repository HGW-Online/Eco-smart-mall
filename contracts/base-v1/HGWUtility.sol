// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract HGWUtility is ERC20 {
    address public immutable governance;
    error Unauthorized();
    constructor(address treasury, address governor) ERC20("Humanity Global Welfare", "HGw") {
        require(treasury != address(0) && governor.code.length > 0, "invalid configuration");
        governance = governor;
        _mint(treasury, 1_000_000_000 ether);
    }
    function mint(address to, uint256 amount) external {
        if(msg.sender != governance) revert Unauthorized();
        require(amount > 0, "zero issuance");
        _mint(to, amount);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin ERC-20. Review the exact resolved dependency before deployment.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title HumanityGlobalWelfareToken
 * @notice Fixed-supply ERC-20 for HGW.
 * @dev Exactly 1 billion tokens are minted once to the wallet that deploys
 *      this contract. There are no privileged mint, pause, blacklist,
 *      upgrade or owner-only methods.
 * @dev NOT an investment prospectus, regulated security, governance right,
 *      or promise of financial returns.
 */
contract HumanityGlobalWelfareToken is ERC20 {
    constructor() ERC20("Humanity Global Welfare", "HGW") {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }
}

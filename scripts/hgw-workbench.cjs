const { spawnSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { resolve } = require('node:path');

const root = resolve(__dirname, '..');
const networks = {
  'celo-sepolia': 'https://celo-sepolia.blockscout.com',
  gnosis: 'https://gnosis.blockscout.com',
};

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}

function verifyArtifact() {
  const artifact = JSON.parse(readFileSync(resolve(root, 'site/hgw-deploy-artifact.json')));
  const hash = (value) => createHash('sha256').update(value).digest('hex');
  const source = readFileSync(resolve(root, 'contracts/HGWToken.sol'));
  if (!/^0x[0-9a-f]+$/i.test(artifact.bytecode) ||
      artifact.sourceSha256 !== hash(source) ||
      artifact.bytecodeSha256 !== hash(artifact.bytecode)) {
    throw new Error('Artifact hashes do not match the checked-in source and bytecode.');
  }
  console.log(JSON.stringify({
    compiler: artifact.compiler,
    chainId: artifact.chainId,
    symbol: artifact.symbol,
    totalSupply: artifact.totalSupply,
    sourceSha256: artifact.sourceSha256,
    bytecodeSha256: artifact.bytecodeSha256,
  }, null, 2));
}

const [command = 'help', network, identifier] = process.argv.slice(2);
try {
  switch (command) {
    case 'help':
      console.log([
        'HGW GitHub Workbench',
        'compile           Compile HGW locally with the existing Solidity build',
        'verify-artifact   Check local Solidity source and bytecode hashes',
        'identity-test     Run the existing Signicat sandbox test suite',
        'explorer <celo-sepolia|gnosis> <address|transaction hash>',
        'links             Show editor, banking, wallet and contract entry points',
      ].join('\n'));
      break;
    case 'compile':
      run(process.execPath, ['scripts/hgw-compile.cjs']);
      break;
    case 'verify-artifact':
      verifyArtifact();
      break;
    case 'identity-test':
      run(process.execPath, ['--test', 'test.cjs'], resolve(root, 'integrations/signicat'));
      break;
    case 'explorer': {
      if (!Object.hasOwn(networks, network) || !/^0x(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(identifier ?? '')) {
        throw new Error('Supply a supported network and an EVM address or transaction hash.');
      }
      const type = identifier.length === 42 ? 'address' : 'tx';
      console.log(new URL('/' + type + '/' + identifier, networks[network]).href);
      break;
    }
    case 'links':
      console.log([
        'VS Code / Codespaces: https://github.com/codespaces/new?repo=1431675578',
        'Remix IDE: https://remix.ethereum.org/',
        'Solidity / OpenZeppelin: contracts/HGWToken.sol',
        'Signicat / eID: integrations/signicat/README.md',
        'Tink / WalletConnect: docs/HGW-WALLETCONNECT-TINK-READONLY-INTEGRATION.md',
        'Lunar: docs/LUNAR-OPEN-BANKING-INTEGRATION.md',
      ].join('\n'));
      break;
    default:
      throw new Error('Unknown command. Run with help for available commands.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

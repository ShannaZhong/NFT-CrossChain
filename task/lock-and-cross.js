const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");

task("lock-and-cross")
  .addOptionalParam("chainselector", "chain selector of dest chain")
  .addOptionalParam("receiver", "receiver address on dest chain")
  .addParam("tokenid", "token id to be crossed chain")
  .setAction(async (taskArgs, hre) => {
    const { firstAccount } = await hre.getNamedAccounts();
    const chainSelector = taskArgs?.chainselector || networkConfig[network.config.chainId].companionChainSelector;
    console.log(`chainSelector is ${chainSelector}`);
    const tokenId = taskArgs.tokenid;
    let receiver;
    if (taskArgs.receiver) {
        receiver = taskArgs.receiver;
    } else {
      const nftPoolBurnAndMintDeployment = await hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint");
      receiver = nftPoolBurnAndMintDeployment.address;
      console.log("receiver is not set in command");
    }
    console.log(`receiver's address is ${receiver}`);

    // transfer 10 link token to address of pool
    const linkTokenAddress = networkConfig[network.config.chainId].linkToken;
    const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress);
    const nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount);
    const transferTx =  await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther("2"));
    transferTx.wait(6);
    const balance = await linkToken.balanceOf(nftPoolLockAndRelease.target);
    console.log(`balance of pool is ${balance}`);

    // approve pool address to call transferFrom
    const nft = await ethers.getContract("MyToken", firstAccount);
    await nft.approve(nftPoolLockAndRelease.target, tokenId);
    console.log(`approve success.`);

    // call lockAndSendNFT
    const lockAndSendNFTtx = await nftPoolLockAndRelease.lockAndSendNFT(
        tokenId,
        firstAccount,
        chainSelector,
        receiver,
    )
    console.log(`ccip transaction is sent, the tx is ${lockAndSendNFTtx.hash}`);
})

module.exports = {};
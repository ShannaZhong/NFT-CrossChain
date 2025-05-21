const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");

task("burn-and-cross")
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
      const nftPoolLockAndReleaseDeployment = await hre.companionNetworks["destChain"].deployments.get("NFTPoolLockAndRelease");
      receiver = nftPoolLockAndReleaseDeployment.address;
      console.log("receiver is not set in command");
    }
    console.log(`receiver's address is ${receiver}`);

    // transfer 10 link token to address of pool
    const linkTokenAddress = networkConfig[network.config.chainId].linkToken;
    const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress);
    const nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount);
    const transferTx =  await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther("2"));
    transferTx.wait(6);
    const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target);
    console.log(`balance of pool is ${balance}`);

    // approve pool address to call transferFrom
    const wnft = await ethers.getContract("WrappedMyToken", firstAccount);
    await wnft.approve(nftPoolBurnAndMint.target, tokenId);
    console.log(`approve success.`);

    // call burnAndSendNFT
    const burnAndSendNFTtx = await nftPoolBurnAndMint.burnAndSendNFT(
        tokenId,
        firstAccount,
        chainSelector,
        receiver,
    )
    console.log(`ccip transaction is sent, the tx is ${burnAndSendNFTtx.hash}`);
})

module.exports = {};
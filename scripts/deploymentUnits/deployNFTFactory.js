async function deployNFTFactory(_marketAddress) {
    const NFTFactory = await ethers.getContractFactory("NFTFactory");
    const nFTFactory = await NFTFactory.deploy(_marketAddress, { gasPrice: 130 * 10**9, gasLimit: 10**7 });
    await nFTFactory.waitForDeployment();
    const nFTFactory_address = await nFTFactory.getAddress();
    console.log("`NFTFactory` deployed to:", nFTFactory_address);
    console.log("");
}

module.exports = { deployNFTFactory };
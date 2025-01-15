async function deployNFTMarketplace() {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nFTMarketplace = await NFTMarketplace.deploy( { gasPrice: 130 * 10**9, gasLimit: 10**7 });
    await nFTMarketplace.waitForDeployment();
    const nFTMarketplace_address = await nFTMarketplace.getAddress();
    console.log("`NFTMarketplace` deployed to:", nFTMarketplace_address);
    console.log("");
}

module.exports = { deployNFTMarketplace };
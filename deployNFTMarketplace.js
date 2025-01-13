async function deployNFTMarketplace(name, symbol) {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nFTMarketplace = await NFTMarketplace.deploy(name, symbol, { gasPrice: 130 * 10**9, gasLimit: 10**7 });
    await nFTMarketplace.waitForDeployment();
    const nFTMarketplace_address = await nFTMarketplace.getAddress();
    console.log("`NFTMarketplace` deployed to:", nFTMarketplace_address);
    console.log("");
}

module.exports = { deployNFTMarketplace };
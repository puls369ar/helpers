async function deploySuperwineNFT(_name,_symbol,_baseURI2Set,_royalty,_marketAddress) {
    const SuperwineNFT = await ethers.getContractFactory("SuperwineNFT");
    const superwineNFT = await SuperwineNFT.deploy(_name,_symbol,_baseURI2Set,_royalty,_marketAddress, { gasPrice: 130 * 10**9, gasLimit: 10**7 });
    await superwineNFT.waitForDeployment();
    const superwineNFT_address = await superwineNFT.getAddress();
    console.log("`SuperwineNFT` deployed to:", superwineNFT_address);
    console.log("");
}

module.exports = { deploySuperwineNFT };
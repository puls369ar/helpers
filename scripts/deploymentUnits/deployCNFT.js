async function deployCNFT(_name,_symbol) {
    const CNFT = await ethers.getContractFactory("CNFT");
    const cNFT = await CNFT.deploy(_name,_symbol, { gasPrice: 130 * 10**9, gasLimit: 10**7 });
    await cNFT.waitForDeployment();
    const cNFT_address = await cNFT.getAddress();
    console.log("`CNFT` deployed to:", cNFT_address);
    console.log("");
}

module.exports = { deployCNFT };
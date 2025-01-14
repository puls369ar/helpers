async function deploycontractName() {
    const contractName = await ethers.getContractFactory("contractName");
    const contractName = await contractName.deploy( { gasPrice: 130 * 10**9, gasLimit: 10**7 });
    await contractName.waitForDeployment();
    const contractName_address = await contractName.getAddress();
    console.log("`contractName` deployed to:", contractName_address);
    console.log("");
}

module.exports = { deploycontractName };
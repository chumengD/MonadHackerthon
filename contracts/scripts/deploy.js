const hre = require("hardhat");

async function main() {
  console.log("Deploying TreasureMap contract...");

  // 获取部署者账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 获取账户余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // 部署 TreasureMap 合约
  const TreasureMap = await hre.ethers.getContractFactory("TreasureMap");
  const treasureMap = await TreasureMap.deploy();

  await treasureMap.waitForDeployment();

  const contractAddress = await treasureMap.getAddress();
  console.log("TreasureMap deployed to:", contractAddress);

  // 验证部署
  console.log("\n--- Deployment Summary ---");
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("------------------------\n");

  // 如果不是本地网络，等待几个区块后验证合约
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // 等待 30 秒

    console.log("Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  return contractAddress;
}

main()
  .then((address) => {
    console.log("Deployment completed! Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

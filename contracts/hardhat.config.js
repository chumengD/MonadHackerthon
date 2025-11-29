require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28", // 这里的版本号要和你合约里的 pragma solidity ^0.8.20 匹配
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // 如果你需要部署到测试网，后续在这里添加 networks 配置
  networks: {
    hardhat: {
    },
    monad_testnet: {
      url: process.env.RPC_URL, // 链的节点地址
      accounts: [PRIVATE_KEY], // 部署用的钱包私钥
      chainId: 10143, // (可选) 填写该链的 Chain ID，防发错链，不填也能跑
    },
  },
};
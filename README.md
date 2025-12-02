### 1\. 项目目录结构 (Project Directory Structure)

我们将项目分为三个核心文件夹：`contracts` (智能合约)、`backend` (AI 服务)、`frontend` (Web 端)。

```text
web3-treasure-hunt/
├── README.md                   # 项目总说明文档 (见下文)
├── .gitignore                  # 全局忽略文件
├── .env.example                # 环境变量模版 (包含 OpenAI Key, 私钥等)
│
├── contracts/                  # [智能合约层] Solidity & Hardhat/Foundry
│   ├── contracts/
│   │   ├── TreasureMap.sol     # 核心业务合约 (创建、解锁、解密)
│   │   ├── interfaces/
│   │   │   └── IX402.sol       # x402 协议接口
│   │   └── libraries/          # 工具库 (如 Commit-Reveal 校验)
│   ├── scripts/                # 部署脚本 (Deploy.js)
│   ├── test/                   # 合约测试用例
│   └── hardhat.config.js       # Hardhat 配置
│
├── backend/                    # [服务端层] Python FastAPI (AI 生成)
│   ├── app/
│   │   ├── main.py             # API 入口
│   │   ├── services/
│   │   │   ├── openai_service.py # GPT-4 & DALL-E 调用逻辑
│   │   │   └── ipfs_service.py   # (可选) 后端辅助上传 IPFS
│   │   └── utils/
│   ├── requirements.txt        # Python 依赖
│   └── Dockerfile              # (可选) 容器化部署
│
└── frontend/                   # [客户端层] Next.js + RainbowKit
    ├── public/                 # 静态资源
    ├── src/
    │   ├── components/         # UI 组件
    │   │   ├── CreateMap/      # 创建页组件
    │   │   ├── MapCard.tsx     # 藏宝图卡片
    │   │   ├── PaymentGate.tsx # x402 支付解锁组件
    │   │   └── SolvePuzzle.tsx # 答题与 Reveal 组件
    │   ├── hooks/              # 自定义 Hooks (useMapData, useCommit)
    │   ├── utils/              # 工具函数 (生成哈希、Salt)
    │   ├── abis/               # 合约 ABI 文件
    │   └── app/                # Next.js 路由页面
    ├── package.json
    └── tailwind.config.js
```

# 🏴‍☠️ CryptoHunter (Web3 Treasure Hunt)

> **Hackathon Track**: GameFi / SocialFi / AI
>
> **One Liner**: 一个结合 AIGC 与博弈论的去中心化藏宝图平台，利用 Commit-Reveal 机制防抢跑，集成 x402 协议实现“付费即解锁”。

## 📖 项目简介 (Introduction)

CryptoHunter 是一个建立在链上的互动解谜游戏平台。

  * **对于创作者**：利用 **AI (GPT-4 & DALL-E)** 零门槛生成复杂的谜面故事和藏宝图，设置奖金（MON/Token）和**入场费（Entry Fee）**。
  * **对于玩家**：支付少量费用（通过 **x402 协议**）解锁谜题内容，利用智慧解开谜题，赢得奖金池。
  * **对于生态**：完全去中心化的 **Winner-Takes-All** 模式，结合 **Commit-Reveal** 机制彻底解决链上解谜游戏常见的“抢跑（Front-running）”问题。

## 🌟 核心功能 (Key Features)

1.  **🤖 AI 驱动的内容生成**: 集成 OpenAI API，创作者只需输入关键词，即可自动生成沉浸式谜题故事与视觉线索。
2.  **🔐 x402 协议付费门票**: 引入“付费查看（Pay-to-Unlock）”机制。玩家必须支付入场费才能查看谜题详情，保障创作者收益。
3.  **🛡️ 提交-揭示 (Commit-Reveal) 防抢跑**:
      * **Phase 1**: 提交 `Hash(答案 + 盐 + 地址)`，不上链明文。
      * **Phase 2**: 揭示明文，合约验证哈希一致性。
      * 有效防止 MEV 机器人通过监听 Mempool 窃取答案。
4.  **🏆 赢家通吃 (Winner-Takes-All)**: 第一个验证成功的玩家拿走全部奖金，博弈机制促使玩家解密后立即领奖，而非倒卖答案。

## 🛠 技术栈 (Tech Stack)

  * **Frontend**: Next.js, TailwindCSS, RainbowKit, Wagmi, Viem
  * **Smart Contract**: Solidity, Hardhat, x402 Protocol Interface
  * **Backend (AI)**: Python, FastAPI, OpenAI API
  * **Storage**: IPFS (Web3.Storage / Pinata)

## 🚀 快速开始 (Quick Start)

### 前置要求

  * Node.js v18+
  * Python 3.9+
  * MetaMask 钱包
  * OpenAI API Key

### 1\. 环境配置 (Environment Setup)

在根目录创建 `.env` 文件 (参考 `.env.example`):

```bash
# Backend
OPENAI_API_KEY="sk-..."

# Contracts
PRIVATE_KEY="0x..."
SEPOLIA_RPC_URL="https://..."

# Frontend
NEXT_PUBLIC_WALLET_CONNECT_ID="..."
NEXT_PUBLIC_CONTRACT_ADDRESS="..."
```

### 2\. 智能合约部署 (Contracts)

```bash
cd contracts
npm install

# 编译合约
npx hardhat compile

# 部署到测试网 (例如 monad testnet)
npx hardhat run scripts/deploy.js --network monad testnet
```

*部署后，请将生成的合约地址更新到前端的 `.env` 文件中。*

### 3\. 启动 AI 后端服务 (Backend)

```bash
cd backend
pip install -r requirements.txt

# 启动 FastAPI 服务 (默认运行在 http://localhost:8000)
uvicorn app.main:app --reload
```

### 4\. 启动前端 (Frontend)

```bash
cd frontend
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:3000` 即可开始寻宝！

## 🧩 核心逻辑说明

### Commit-Reveal 流程

为了防止机器人抢跑，我们不直接验证答案明文。

1.  **Commit**: 用户在本地计算 `CommitHash = Keccak256(Answer + Salt + Address)` 并提交上链。
2.  **Wait**: 等待至少 1 个区块确认。
3.  **Reveal**: 用户提交 `(Answer, Salt)`，合约重新计算哈希并比对链上记录。

### x402 集成逻辑

合约中的 `unlockMap` 函数要求 `msg.value >= entryFee`。前端通过 x402 协议进行支付，资金直接流向创作者，通过从根本上建立商业闭环，激励优质内容产出。

## 📄 License

MIT

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IX402.sol";

/**
 * @title TreasureMap
 * @dev 核心业务合约 - 创建、解锁、解密藏宝图
 * @notice 使用 Commit-Reveal 机制防止抢跑攻击
 */
contract TreasureMap {
    // ============ 状态变量 ============
    
    struct Map {
        address creator;
        string metadataURI;      // IPFS URI 存储谜题内容
        bytes32 answerHash;      // 正确答案的哈希
        uint256 prizePool;       // 奖金池
        uint256 entryFee;        // 入场费
        bool solved;             // 是否已解决
        address winner;          // 获胜者地址
    }

    struct Commit {
        bytes32 commitHash;
        uint256 blockNumber;
        bool revealed;
    }

    uint256 public mapCount;
    mapping(uint256 => Map) public maps;
    mapping(uint256 => mapping(address => Commit)) public commits;
    mapping(uint256 => mapping(address => bool)) public hasUnlocked;

    // ============ 事件 ============
    
    event MapCreated(uint256 indexed mapId, address indexed creator, uint256 prizePool, uint256 entryFee);
    event MapUnlocked(uint256 indexed mapId, address indexed player);
    event AnswerCommitted(uint256 indexed mapId, address indexed player, bytes32 commitHash);
    event AnswerRevealed(uint256 indexed mapId, address indexed player, bool correct);
    event PrizeClaimed(uint256 indexed mapId, address indexed winner, uint256 amount);

    // ============ 修饰器 ============
    
    modifier mapExists(uint256 mapId) {
        require(mapId < mapCount, "TreasureMap: map does not exist");
        _;
    }

    modifier notSolved(uint256 mapId) {
        require(!maps[mapId].solved, "TreasureMap: already solved");
        _;
    }

    // ============ 核心函数 ============

    /**
     * @dev 创建新的藏宝图
     * @param metadataURI IPFS URI 存储谜题元数据
     * @param answerHash 正确答案的 keccak256 哈希
     * @param entryFee 解锁谜题所需的入场费
     */
    function createMap(
        string calldata metadataURI,
        bytes32 answerHash,
        uint256 entryFee
    ) external payable returns (uint256) {
        require(msg.value > 0, "TreasureMap: prize pool required");
        require(answerHash != bytes32(0), "TreasureMap: invalid answer hash");

        uint256 mapId = mapCount++;
        maps[mapId] = Map({
            creator: msg.sender,
            metadataURI: metadataURI,
            answerHash: answerHash,
            prizePool: msg.value,
            entryFee: entryFee,
            solved: false,
            winner: address(0)
        });

        emit MapCreated(mapId, msg.sender, msg.value, entryFee);
        return mapId;
    }

    /**
     * @dev 支付入场费解锁谜题 (x402 协议集成)
     * @param mapId 藏宝图 ID
     */
    function unlockMap(uint256 mapId) external payable mapExists(mapId) notSolved(mapId) {
        Map storage map = maps[mapId];
        require(msg.value >= map.entryFee, "TreasureMap: insufficient entry fee");
        require(!hasUnlocked[mapId][msg.sender], "TreasureMap: already unlocked");

        hasUnlocked[mapId][msg.sender] = true;
        
        // 入场费直接转给创作者
        if (msg.value > 0) {
            payable(map.creator).transfer(msg.value);
        }

        emit MapUnlocked(mapId, msg.sender);
    }

    /**
     * @dev Phase 1: 提交答案哈希 (Commit)
     * @param mapId 藏宝图 ID
     * @param commitHash Hash(答案 + 盐 + 地址)
     */
    function commitAnswer(uint256 mapId, bytes32 commitHash) external mapExists(mapId) notSolved(mapId) {
        require(hasUnlocked[mapId][msg.sender], "TreasureMap: must unlock first");
        require(commits[mapId][msg.sender].commitHash == bytes32(0), "TreasureMap: already committed");

        commits[mapId][msg.sender] = Commit({
            commitHash: commitHash,
            blockNumber: block.number,
            revealed: false
        });

        emit AnswerCommitted(mapId, msg.sender, commitHash);
    }

    /**
     * @dev Phase 2: 揭示答案 (Reveal)
     * @param mapId 藏宝图 ID
     * @param answer 明文答案
     * @param salt 随机盐值
     */
    function revealAnswer(uint256 mapId, string calldata answer, bytes32 salt) 
        external 
        mapExists(mapId) 
        notSolved(mapId) 
    {
        Commit storage commit = commits[mapId][msg.sender];
        require(commit.commitHash != bytes32(0), "TreasureMap: no commit found");
        require(!commit.revealed, "TreasureMap: already revealed");
        require(block.number > commit.blockNumber, "TreasureMap: wait at least 1 block");

        // 验证 commit hash
        bytes32 expectedHash = keccak256(abi.encodePacked(answer, salt, msg.sender));
        require(commit.commitHash == expectedHash, "TreasureMap: invalid reveal");

        commit.revealed = true;

        // 验证答案是否正确
        bytes32 answerHash = keccak256(abi.encodePacked(answer));
        bool correct = (answerHash == maps[mapId].answerHash);

        if (correct) {
            maps[mapId].solved = true;
            maps[mapId].winner = msg.sender;
            
            // 发放奖金
            uint256 prize = maps[mapId].prizePool;
            payable(msg.sender).transfer(prize);
            
            emit PrizeClaimed(mapId, msg.sender, prize);
        }

        emit AnswerRevealed(mapId, msg.sender, correct);
    }

    // ============ 查询函数 ============

    /**
     * @dev 获取藏宝图信息
     */
    function getMap(uint256 mapId) external view mapExists(mapId) returns (
        address creator,
        string memory metadataURI,
        uint256 prizePool,
        uint256 entryFee,
        bool solved,
        address winner
    ) {
        Map storage map = maps[mapId];
        return (
            map.creator,
            map.metadataURI,
            map.prizePool,
            map.entryFee,
            map.solved,
            map.winner
        );
    }

    /**
     * @dev 检查用户是否已解锁某个藏宝图
     */
    function isUnlocked(uint256 mapId, address user) external view returns (bool) {
        return hasUnlocked[mapId][user];
    }

    /**
     * @dev 生成 Commit Hash 的辅助函数（用于前端）
     */
    function generateCommitHash(string calldata answer, bytes32 salt, address user) 
        external 
        pure 
        returns (bytes32) 
    {
        return keccak256(abi.encodePacked(answer, salt, user));
    }
}

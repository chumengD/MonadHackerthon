// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title TreasureMap
 * @dev 核心业务合约 - 创建、解锁、解密藏宝图
 * @notice 使用 Commit-Reveal 机制防止抢跑攻击
 */
contract TreasureMap {
    // ============ 状态变量 ============
    
    struct Map {
        string name;             // Map_name
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
    }

    uint256 public mapCount;
    mapping(uint256 => Map) public maps;                                // map_id -> map
    mapping(uint256 => mapping(address => Commit)) public commits;      // map_id -> (player -> commit)
    mapping(uint256 => mapping(address => bool)) public hasUnlocked;    // map_id -> (player -> hasUnlocked)

    // ============ 事件 ============
    
    // map创建事件
    event MapCreated(uint256 indexed mapId, address indexed creator, uint256 prizePool, uint256 entryFee);
    // 解锁map事件
    event MapUnlocked(uint256 indexed mapId, address indexed player);
    // 答案提交事件
    event AnswerCommitted(uint256 indexed mapId, address indexed player, bytes32 commitHash);
    // 错误答案声明
    event AnswerIsWrong(uint256 indexed mapId, address indexed player);
    // 产生赢家事件
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
        uint256 entryFee,
        string calldata mapName
    ) external payable returns (uint256) {
        require(msg.value > 0, "TreasureMap: prize pool required");
        require(answerHash != bytes32(0), "TreasureMap: invalid answer hash");

        uint256 mapId = mapCount++;
        maps[mapId] = Map({
            name: mapName,
            creator: msg.sender,
            metadataURI: metadataURI,
            answerHash: answerHash,
            prizePool: msg.value, // 将value存入合约
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
    // 狗都不用x402协议！！！
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
     * @param salt Hash 的盐值
     */
    function commitAnswer_and_CheckAnswer(uint256 mapId, bytes32 commitHash, bytes32 salt) external mapExists(mapId) notSolved(mapId) {
        require(hasUnlocked[mapId][msg.sender], "TreasureMap: must unlock first");
        require(commits[mapId][msg.sender].commitHash == bytes32(0), "TreasureMap: already committed");

        commits[mapId][msg.sender] = Commit({
            commitHash: commitHash
        });

        emit AnswerCommitted(mapId, msg.sender, commitHash);

        if (commitHash == keccak256(abi.encodePacked(maps[mapId].answerHash, salt, msg.sender))) {
            maps[mapId].solved = true;
            maps[mapId].winner = msg.sender;
            
            // 发放奖金
            uint256 prize = maps[mapId].prizePool;
            payable(msg.sender).transfer(prize);
            
            emit PrizeClaimed(mapId, msg.sender, prize);

        } else {
            commits[mapId][msg.sender].commitHash = bytes32(0);
            emit AnswerIsWrong(mapId, msg.sender);
        }
    }

    // ============ 查询函数 ============

    /**
     * @dev 获取藏宝图信息
     */
    function getMap(uint256 mapId) external view mapExists(mapId) returns (
        address creator,
        string memory name,
        string memory metadataURI,
        uint256 prizePool,
        uint256 entryFee,
        bool solved,
        address winner
    ) {
        Map storage map = maps[mapId];
        return (
            map.creator,
            map.name,
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
    function generateCommitHash(bytes32 answerHash, bytes32 salt, address user) 
        external 
        pure 
        returns (bytes32) 
    {
        return keccak256(abi.encodePacked(answerHash, salt, user));
    }

    /**
     * @dev 生成 Answer Hash 的辅助函数（用于前端）
     */
    function generateAnswerHash(string calldata answer) 
        external 
        pure 
        returns (bytes32) 
    {
        return keccak256(abi.encodePacked(answer));
    }
}

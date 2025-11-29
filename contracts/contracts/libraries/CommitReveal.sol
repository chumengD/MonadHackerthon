// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title CommitReveal
 * @dev Commit-Reveal 机制工具库
 * @notice 用于防止抢跑攻击的密码学工具函数
 */
library CommitReveal {
    /**
     * @dev 生成 commit 哈希
     * @param answer 明文答案
     * @param salt 随机盐值
     * @param sender 提交者地址
     * @return commit 哈希值
     */
    function generateCommitHash(
        string memory answer,
        bytes32 salt,
        address sender
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(answer, salt, sender));
    }

    /**
     * @dev 验证 reveal 是否与 commit 匹配
     * @param commitHash 之前提交的哈希
     * @param answer 明文答案
     * @param salt 随机盐值
     * @param sender 提交者地址
     * @return 验证是否通过
     */
    function verifyReveal(
        bytes32 commitHash,
        string memory answer,
        bytes32 salt,
        address sender
    ) internal pure returns (bool) {
        return commitHash == generateCommitHash(answer, salt, sender);
    }

    /**
     * @dev 生成答案哈希（用于创建藏宝图时存储）
     * @param answer 明文答案
     * @return 答案的 keccak256 哈希
     */
    function hashAnswer(string memory answer) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(answer));
    }

    /**
     * @dev 验证答案是否正确
     * @param answer 用户提供的答案
     * @param storedHash 存储的正确答案哈希
     * @return 答案是否正确
     */
    function verifyAnswer(
        string memory answer,
        bytes32 storedHash
    ) internal pure returns (bool) {
        return hashAnswer(answer) == storedHash;
    }

    /**
     * @dev 生成安全的随机盐值（仅用于链下）
     * @notice 注意：这个函数使用 block 信息，不适合用于安全敏感场景
     *         生产环境中应在前端使用更安全的随机数生成方法
     * @param nonce 随机数种子
     * @return 生成的盐值
     */
    function generateSalt(uint256 nonce) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            nonce
        ));
    }
}

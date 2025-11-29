// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IX402
 * @dev x402 协议接口 - 实现 "付费即解锁" 功能
 * @notice 该接口定义了 x402 协议的核心方法
 */
interface IX402 {
    /**
     * @dev 当支付成功完成时触发
     * @param payer 付款人地址
     * @param payee 收款人地址
     * @param amount 支付金额
     * @param resourceId 资源标识符
     */
    event PaymentCompleted(
        address indexed payer,
        address indexed payee,
        uint256 amount,
        bytes32 indexed resourceId
    );

    /**
     * @dev 当资源被解锁时触发
     * @param user 用户地址
     * @param resourceId 资源标识符
     */
    event ResourceUnlocked(
        address indexed user,
        bytes32 indexed resourceId
    );

    /**
     * @dev 检查资源是否需要付费
     * @param resourceId 资源标识符
     * @return required 是否需要付费
     * @return amount 所需金额
     */
    function paymentRequired(bytes32 resourceId) 
        external 
        view 
        returns (bool required, uint256 amount);

    /**
     * @dev 为指定资源进行支付
     * @param resourceId 资源标识符
     */
    function pay(bytes32 resourceId) external payable;

    /**
     * @dev 检查用户是否已解锁指定资源
     * @param user 用户地址
     * @param resourceId 资源标识符
     * @return 是否已解锁
     */
    function hasAccess(address user, bytes32 resourceId) 
        external 
        view 
        returns (bool);

    /**
     * @dev 获取资源的收款人地址
     * @param resourceId 资源标识符
     * @return 收款人地址
     */
    function getPayee(bytes32 resourceId) external view returns (address);

    /**
     * @dev 获取资源的价格
     * @param resourceId 资源标识符
     * @return 价格（以 wei 为单位）
     */
    function getPrice(bytes32 resourceId) external view returns (uint256);
}

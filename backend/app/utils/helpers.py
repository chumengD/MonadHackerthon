"""
Utility functions for CryptoHunter Backend
"""

import hashlib
import secrets
from typing import Optional


def generate_salt() -> str:
    """Generate a cryptographically secure random salt"""
    return secrets.token_hex(32)


def hash_answer(answer: str) -> str:
    """
    Hash an answer using keccak256 (compatible with Solidity)
    
    Args:
        answer: The answer to hash
    
    Returns:
        Hex string of the hash
    """
    from eth_hash.auto import keccak
    return "0x" + keccak(answer.encode()).hex()


def generate_commit_hash(answer: str, salt: str, address: str) -> str:
    """
    Generate a commit hash compatible with the smart contract
    
    Args:
        answer: The answer
        salt: Random salt (hex string)
        address: User's Ethereum address
    
    Returns:
        Hex string of the commit hash
    """
    from eth_abi import encode
    from eth_hash.auto import keccak
    
    # Remove 0x prefix if present
    salt_bytes = bytes.fromhex(salt.replace("0x", ""))
    address_bytes = bytes.fromhex(address.replace("0x", ""))
    
    # Encode like Solidity's abi.encodePacked
    packed = answer.encode() + salt_bytes + address_bytes
    
    return "0x" + keccak(packed).hex()


def validate_ethereum_address(address: str) -> bool:
    """
    Validate an Ethereum address format
    
    Args:
        address: Address to validate
    
    Returns:
        True if valid, False otherwise
    """
    if not address:
        return False
    
    if not address.startswith("0x"):
        return False
    
    if len(address) != 42:
        return False
    
    try:
        int(address, 16)
        return True
    except ValueError:
        return False


def truncate_text(text: str, max_length: int = 100) -> str:
    """
    Truncate text to a maximum length with ellipsis
    
    Args:
        text: Text to truncate
        max_length: Maximum length
    
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."

"""
IPFS Service - Decentralized Storage Integration
Handles uploading content to IPFS via Web3.Storage or Pinata
"""

import os
import json
import aiohttp
from typing import Optional


class IPFSService:
    """Service for interacting with IPFS storage providers"""
    
    def __init__(self):
        # Support multiple IPFS providers
        self.web3_storage_token = os.getenv("WEB3_STORAGE_TOKEN")
        self.pinata_api_key = os.getenv("PINATA_API_KEY")
        self.pinata_secret = os.getenv("PINATA_SECRET")
        
        # Default gateway for retrieval
        self.gateway = os.getenv("IPFS_GATEWAY", "https://w3s.link/ipfs/")
    
    async def upload_json(
        self,
        content: dict,
        filename: str = "metadata.json"
    ) -> str:
        """
        Upload JSON content to IPFS
        
        Args:
            content: Dictionary to upload as JSON
            filename: Name of the file
        
        Returns:
            IPFS URI (ipfs://...)
        """
        # Try Web3.Storage first
        if self.web3_storage_token:
            return await self._upload_to_web3_storage(content, filename)
        
        # Fall back to Pinata
        if self.pinata_api_key and self.pinata_secret:
            return await self._upload_to_pinata(content, filename)
        
        # If no IPFS service configured, return mock URI for development
        import hashlib
        content_hash = hashlib.sha256(json.dumps(content).encode()).hexdigest()
        return f"ipfs://Qm{content_hash[:44]}"
    
    async def _upload_to_web3_storage(
        self,
        content: dict,
        filename: str
    ) -> str:
        """Upload to Web3.Storage"""
        url = "https://api.web3.storage/upload"
        headers = {
            "Authorization": f"Bearer {self.web3_storage_token}",
            "X-NAME": filename
        }
        
        json_content = json.dumps(content, ensure_ascii=False)
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                url,
                headers=headers,
                data=json_content.encode("utf-8")
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    cid = result.get("cid")
                    return f"ipfs://{cid}"
                else:
                    error = await response.text()
                    raise Exception(f"Web3.Storage upload failed: {error}")
    
    async def _upload_to_pinata(
        self,
        content: dict,
        filename: str
    ) -> str:
        """Upload to Pinata"""
        url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
        headers = {
            "pinata_api_key": self.pinata_api_key,
            "pinata_secret_api_key": self.pinata_secret,
            "Content-Type": "application/json"
        }
        
        payload = {
            "pinataContent": content,
            "pinataMetadata": {
                "name": filename
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                url,
                headers=headers,
                json=payload
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    ipfs_hash = result.get("IpfsHash")
                    return f"ipfs://{ipfs_hash}"
                else:
                    error = await response.text()
                    raise Exception(f"Pinata upload failed: {error}")
    
    async def upload_file(
        self,
        file_content: bytes,
        filename: str,
        content_type: str = "application/octet-stream"
    ) -> str:
        """
        Upload a binary file to IPFS
        
        Args:
            file_content: Binary content to upload
            filename: Name of the file
            content_type: MIME type of the file
        
        Returns:
            IPFS URI (ipfs://...)
        """
        if self.web3_storage_token:
            return await self._upload_file_to_web3_storage(
                file_content, filename, content_type
            )
        
        if self.pinata_api_key and self.pinata_secret:
            return await self._upload_file_to_pinata(
                file_content, filename, content_type
            )
        
        # Mock for development
        import hashlib
        content_hash = hashlib.sha256(file_content).hexdigest()
        return f"ipfs://Qm{content_hash[:44]}"
    
    async def _upload_file_to_web3_storage(
        self,
        file_content: bytes,
        filename: str,
        content_type: str
    ) -> str:
        """Upload binary file to Web3.Storage"""
        url = "https://api.web3.storage/upload"
        headers = {
            "Authorization": f"Bearer {self.web3_storage_token}",
            "X-NAME": filename
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                url,
                headers=headers,
                data=file_content
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    cid = result.get("cid")
                    return f"ipfs://{cid}"
                else:
                    error = await response.text()
                    raise Exception(f"Web3.Storage file upload failed: {error}")
    
    async def _upload_file_to_pinata(
        self,
        file_content: bytes,
        filename: str,
        content_type: str
    ) -> str:
        """Upload binary file to Pinata"""
        url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
        headers = {
            "pinata_api_key": self.pinata_api_key,
            "pinata_secret_api_key": self.pinata_secret
        }
        
        form_data = aiohttp.FormData()
        form_data.add_field(
            "file",
            file_content,
            filename=filename,
            content_type=content_type
        )
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                url,
                headers=headers,
                data=form_data
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    ipfs_hash = result.get("IpfsHash")
                    return f"ipfs://{ipfs_hash}"
                else:
                    error = await response.text()
                    raise Exception(f"Pinata file upload failed: {error}")
    
    def get_gateway_url(self, ipfs_uri: str) -> str:
        """
        Convert IPFS URI to HTTP gateway URL
        
        Args:
            ipfs_uri: IPFS URI (ipfs://...)
        
        Returns:
            HTTP gateway URL
        """
        if ipfs_uri.startswith("ipfs://"):
            cid = ipfs_uri[7:]  # Remove "ipfs://"
            return f"{self.gateway}{cid}"
        return ipfs_uri

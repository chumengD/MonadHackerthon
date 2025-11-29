"""
CryptoHunter Backend - FastAPI Application
AI-powered treasure map generation service
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

from app.services.openai_service import OpenAIService
from app.services.ipfs_service import IPFSService

# Initialize FastAPI app
app = FastAPI(
    title="CryptoHunter API",
    description="AI-powered treasure map generation service for Web3 Treasure Hunt",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
openai_service = OpenAIService()
ipfs_service = IPFSService()


# Request/Response Models
class GeneratePuzzleRequest(BaseModel):
    """Request model for puzzle generation"""
    keywords: list[str]
    difficulty: Optional[str] = "medium"  # easy, medium, hard
    language: Optional[str] = "zh"  # zh, en


class GeneratePuzzleResponse(BaseModel):
    """Response model for puzzle generation"""
    story: str
    question: str
    answer: str
    hints: list[str]
    image_url: Optional[str] = None


class GenerateImageRequest(BaseModel):
    """Request model for image generation"""
    description: str
    style: Optional[str] = "treasure map"


class UploadToIPFSRequest(BaseModel):
    """Request model for IPFS upload"""
    content: dict
    filename: Optional[str] = "metadata.json"


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "CryptoHunter API"}


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "version": "1.0.0"
    }


@app.post("/api/generate-puzzle", response_model=GeneratePuzzleResponse)
async def generate_puzzle(request: GeneratePuzzleRequest):
    """
    Generate a treasure hunt puzzle using AI
    
    - **keywords**: List of keywords to inspire the puzzle
    - **difficulty**: Puzzle difficulty (easy, medium, hard)
    - **language**: Output language (zh for Chinese, en for English)
    """
    try:
        result = await openai_service.generate_puzzle(
            keywords=request.keywords,
            difficulty=request.difficulty,
            language=request.language
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-image")
async def generate_image(request: GenerateImageRequest):
    """
    Generate a treasure map image using DALL-E
    
    - **description**: Description of the image to generate
    - **style**: Art style for the image
    """
    try:
        image_url = await openai_service.generate_image(
            description=request.description,
            style=request.style
        )
        return {"image_url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload-ipfs")
async def upload_to_ipfs(request: UploadToIPFSRequest):
    """
    Upload content to IPFS
    
    - **content**: JSON content to upload
    - **filename**: Name of the file
    """
    try:
        ipfs_uri = await ipfs_service.upload_json(
            content=request.content,
            filename=request.filename
        )
        return {"ipfs_uri": ipfs_uri}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/create-treasure-map")
async def create_treasure_map(request: GeneratePuzzleRequest):
    """
    Complete workflow: Generate puzzle, create image, and upload to IPFS
    
    Returns all necessary data to create an on-chain treasure map
    """
    try:
        # Step 1: Generate puzzle
        puzzle = await openai_service.generate_puzzle(
            keywords=request.keywords,
            difficulty=request.difficulty,
            language=request.language
        )
        
        # Step 2: Generate image
        image_url = await openai_service.generate_image(
            description=puzzle["story"][:500],  # Use first 500 chars of story
            style="treasure map"
        )
        puzzle["image_url"] = image_url
        
        # Step 3: Upload to IPFS
        metadata = {
            "story": puzzle["story"],
            "question": puzzle["question"],
            "hints": puzzle["hints"],
            "image_url": image_url,
            "difficulty": request.difficulty
        }
        ipfs_uri = await ipfs_service.upload_json(metadata)
        
        return {
            "puzzle": puzzle,
            "ipfs_uri": ipfs_uri,
            "answer_hash_input": puzzle["answer"]  # Frontend will hash this
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

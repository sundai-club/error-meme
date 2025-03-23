from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from error_meme_generator import generate_meme_for_error
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Error Meme MCP Server")

class ErrorRequest(BaseModel):
    error_message: str
    return_type: str = "url"  # Can be "url" or "base64"

class MemeResponse(BaseModel):
    meme_url: str
    status: str = "success"

@app.post("/generate-meme", response_model=MemeResponse)
async def generate_meme(request: ErrorRequest):
    try:
        meme_url = generate_meme_for_error(request.error_message)
        return MemeResponse(
            meme_url=meme_url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("MCP_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port) 
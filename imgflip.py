import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def generate_meme(template_id, text0, text1):
    """
    Generate a meme using the Imgflip API.
    
    Args:
        template_id (str): The ID of the meme template to use
        text0 (str): The top text of the meme
        text1 (str): The bottom text of the meme
        
    Returns:
        str: URL of the generated meme
        
    Raises:
        Exception: If the API call fails
    """
    url = "https://api.imgflip.com/caption_image"
    payload = {
        "template_id": template_id,
        "username": os.environ.get("IMGFLIP_USERNAME"),
        "password": os.environ.get("IMGFLIP_PASSWORD"),
        "text0": text0,
        "text1": text1
    }
    response = requests.post(url, data=payload).json()
    if response["success"]:
        return response["data"]["url"]
    else:
        raise Exception(response["error_message"])

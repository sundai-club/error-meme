import os
import subprocess
import tempfile
import webbrowser
import pyperclip
import requests
from io import BytesIO
from PIL import Image
from error_meme_generator import ErrorMemeGenerator

def main():
    """
    Main entry point for the error meme generator.
    Reads error text from clipboard, generates a meme, and displays it in a popup window.
    """
    generator = ErrorMemeGenerator()
    try:
        meme_url = generator.create_meme()
        print(f"Meme generated successfully: {meme_url}")
        
        # Copy the URL to clipboard
        pyperclip.copy(meme_url)
        print("URL copied to clipboard")
        
        # Display the meme in a popup window
        display_meme(meme_url)
    except Exception as e:
        print(f"Error: {e}")

def display_meme(url):
    """
    Download the meme image and open it with the default image viewer.
    
    Args:
        url (str): URL of the meme image
    """
    # Download the image
    response = requests.get(url)
    image_data = BytesIO(response.content)
    image = Image.open(image_data)
    
    # Create a temporary file to save the image
    fd, temp_path = tempfile.mkstemp(suffix=".png")
    os.close(fd)  # Close the file descriptor
    
    try:
        # Save the image to the temporary file
        image.save(temp_path)
        print(f"Meme saved to temporary file: {temp_path}")
        
        # Open the image with the default image viewer
        if os.name == 'nt':  # Windows
            os.startfile(temp_path)
        elif os.name == 'posix':  # macOS or Linux
            if os.uname().sysname == 'Darwin':  # macOS
                subprocess.run(['open', temp_path])
            else:  # Linux
                subprocess.run(['xdg-open', temp_path])
        else:
            # Fallback to webbrowser module
            webbrowser.open('file://' + temp_path)
            
        print("Meme opened in default image viewer")
    except Exception as e:
        print(f"Error displaying meme: {e}")
        # Fallback to opening the URL in a browser
        print("Falling back to opening URL in browser")
        webbrowser.open(url)

if __name__ == "__main__":
    main()

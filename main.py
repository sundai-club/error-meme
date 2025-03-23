import webbrowser
import pyperclip
from error_meme_generator import ErrorMemeGenerator

def main():
    """
    Main entry point for the error meme generator.
    Reads error text from clipboard, generates a meme, and opens it in the browser.
    """
    generator = ErrorMemeGenerator()
    try:
        meme_url = generator.create_meme()
        print(f"Meme generated successfully: {meme_url}")
        
        # Copy the URL to clipboard
        pyperclip.copy(meme_url)
        print("URL copied to clipboard")
        
        # Open in browser
        webbrowser.open(meme_url)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()

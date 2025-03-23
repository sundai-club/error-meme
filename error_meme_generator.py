import pyperclip
from imgflip import generate_meme
from config import TEMPLATE_ID

class ErrorMemeGenerator:
    """
    A class to generate memes from error messages in the clipboard.
    """
    
    def get_error_from_clipboard(self):
        """
        Get the error text from the clipboard.
        
        Returns:
            str: The text from the clipboard
        """
        return pyperclip.paste()
    
    def prepare_caption(self, error_text):
        """
        Split the error text into top and bottom captions.
        
        Args:
            error_text (str): The error text to split
            
        Returns:
            tuple: (top_text, bottom_text)
        """
        lines = error_text.splitlines()
        if len(lines) >= 2:
            return lines[0], " ".join(lines[1:])
        return error_text, ""
    
    def create_meme(self):
        """
        Create a meme from the error text in the clipboard.
        
        Returns:
            str: URL of the generated meme
            
        Raises:
            Exception: If no error text is found or if the API call fails
        """
        error_text = self.get_error_from_clipboard()
        if not error_text:
            raise Exception("No error text found in clipboard")
        text0, text1 = self.prepare_caption(error_text)
        return generate_meme(TEMPLATE_ID, text0, text1)

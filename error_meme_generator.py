import pyperclip
from imgflip import generate_meme
import json
import openai
from pydantic import BaseModel


class MemeTask(BaseModel):
    text0: str
    text1: str
    templateId: str

class ErrorMemeGenerator:
    memes = []
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ErrorMemeGenerator, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self):
        if not self.initialized:
            print('loading memes...')
            with open("memes.json", "r") as f:
                self.memes = json.load(f)
            print('memes loaded')
            self.initialized = True
    
    def get_error_from_clipboard(self):
        """
        Get the error text from the clipboard.
        
        Returns:
            str: The text from the clipboard
        """
        return pyperclip.paste()
    
    def prepare_caption(self, error_text) -> MemeTask:
        prompt = f"""
        For a given error text <error>{error_text}</error> find the best meme template from this list:
        <memes>
        {self.memes}
        </memes>
        Return the template id and caption in one or two lines for the meme image in JSON format. Here is an example:
        {{
            "templateId": "12345", 
            "text0": "Top text", 
            "text1": "Bottom text"
        }}
        """
        print('about to call gpt')
        client = openai.Client()
        completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a meme generator assistant that always talks JSON."},
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format=MemeTask
        )
        print('gpt response', completion)
        return completion.choices[0].message.parsed
    
    def create_meme(self):
        error_text = self.get_error_from_clipboard()
        if not error_text:
            raise Exception("No error text found in clipboard")
        return self.generate_meme_from_error(error_text)

    def generate_meme_from_error(self, error_text: str) -> str:
        if not error_text:
            raise Exception("No error text provided")
        meme_task = self.prepare_caption(error_text)
        return generate_meme(meme_task.templateId, meme_task.text0, meme_task.text1)

def generate_meme_for_error(error_text: str) -> str:
    generator = ErrorMemeGenerator()
    return generator.generate_meme_from_error(error_text)

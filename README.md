# Error Meme Generator

A simple tool that reads error text from your clipboard and generates a meme using the Imgflip API.

## Features

- Reads error messages from your clipboard
- Automatically splits the error message into top and bottom text
- Generates a meme using the Imgflip API
- Opens the meme in your default web browser
- Copies the meme URL back to your clipboard

## Setup

1. Clone this repository
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory and add your Imgflip API credentials:
   ```
   IMGFLIP_USERNAME=your_imgflip_username
   IMGFLIP_PASSWORD=your_imgflip_password
   ```

## Usage

1. Copy an error message to your clipboard
2. Run the script:
   ```
   python main.py
   ```
3. The generated meme will open in your default web browser, and the URL will be copied to your clipboard

## MacOS shortcut

1. Open Automator
2. Create a new workflow
3. Add a "Run Script" action
4. Set the script to:
   ```bash
   cd /path/to/error-meme
export OPENAI_API_KEY=your_openai_api_key
bash meme.sh
   ```
5. Save the workflow
6. Assign a keyboard shortcut to the workflow


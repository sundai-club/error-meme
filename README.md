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
3. Edit `config.py` to add your Imgflip username and password:
   ```python
   USERNAME = "your_imgflip_username"
   PASSWORD = "your_imgflip_password"
   ```
   You can also change the default meme template ID if desired.

## Usage

1. Copy an error message to your clipboard
2. Run the script:
   ```
   python main.py
   ```
3. The generated meme will open in your default web browser, and the URL will be copied to your clipboard

## Customization

You can change the meme template by modifying the `TEMPLATE_ID` in `config.py`. Some popular templates include:
- 61579: One Does Not Simply (default)
- 101470: Ancient Aliens
- 87743: Two Buttons
- 438680: Batman Slapping Robin

Visit [Imgflip's API documentation](https://imgflip.com/api) for more information.

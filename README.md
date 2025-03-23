# Error Meme Generator

A simple tool that reads error text from your clipboard and generates a meme using the Imgflip API. It also provides an MCP (Message Control Program) server for integration with AI tools.

## Features

- Reads error messages from your clipboard
- Automatically splits the error message into top and bottom text
- Generates a meme using the Imgflip API
- Opens the meme in your default web browser
- Copies the meme URL back to your clipboard
- MCP server for AI tool integration

## Setup

1. Clone this repository
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory and add your credentials:
   ```
   IMGFLIP_USERNAME=your_imgflip_username
   IMGFLIP_PASSWORD=your_imgflip_password
   OPENAI_API_KEY=your_openai_api_key
   MCP_PORT=8000
   ```

## Usage

### CLI Mode
1. Copy an error message to your clipboard
2. Run the script:
   ```
   python main.py
   ```
3. The generated meme will open in your default web browser, and the URL will be copied to your clipboard

### MCP Server Mode
1. Start the MCP server:
   ```
   python mcp_server.py
   ```
2. The server will be available at `http://localhost:8000`

#### API Endpoints

- `POST /generate-meme`
  ```json
  {
    "error_message": "Your error message here",
    "return_type": "url"  // or "base64"
  }
  ```
  Response:
  ```json
  {
    "meme_url": "https://i.imgflip.com/xxxxx.jpg",
    "temp_file_path": null,
    "status": "success"
  }
  ```

- `GET /health`
  Health check endpoint

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

## Cursor rules

Add a rule to generate a meme everytime you paste an error message.
```
# Error handling
Before trying to fix or analyze the error, generate a meme for it in parallel.
Run commands `cd /Users/ivkin/git/error-meme && source venv/bin/activate && python main.py` in background in parallel and continue handling
```

## AI Tool Integration

To integrate with AI tools, you can use the MCP server. Here's an example of how to use it:

1. Start the MCP server
2. Make HTTP requests to the `/generate-meme` endpoint
3. Use the returned meme URL in your AI tool's response

The MCP server is designed to be lightweight and stateless, making it perfect for integration with AI tools.
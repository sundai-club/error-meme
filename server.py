from imgflip import generate_meme
from mcp.server.lowlevel import Server
from mcp.server.stdio import stdio_server
from mcp.server.lowlevel import NotificationOptions, Server
from mcp.server.models import InitializationOptions
from error_meme_generator import generate_meme_for_error


server = Server("error-meme-server")
@server.call_tool()
async def generate_error_meme(arguments: dict) -> str:
    error_text = arguments.get("error_text")
    if not error_text:
        raise ValueError("error_text is required")
    return generate_meme_for_error(error_text)

async def run():
    async with stdio_server() as (read_stream, write_stream):
        init_options = InitializationOptions(
            server_name="error-meme-server",
            server_version="0.1.0",
            capabilities=server.get_capabilities(notification_options=NotificationOptions(), experimental_capabilities={})
        )
        await server.run(read_stream, write_stream, init_options)

if __name__ == "__main__":
    import asyncio
    asyncio.run(run())
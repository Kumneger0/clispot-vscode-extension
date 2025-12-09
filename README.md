# Clispot VS Code Extension

Control your Spotify playback directly from VS Code. Browse your library, manage playlists, search for music, and control playback without leaving your editor.

## Features

✨ **Library Management**
- Browse your liked songs, playlists, and followed artists
- View playlist tracks and artist top tracks
- Search for tracks, albums, artists, and playlists

🎵 **Playback Control**
- Play/pause tracks
- Skip to next/previous track
- Play tracks from your library or search results
- View and manage your music queue

🎨 **Seamless Integration**
- Dedicated sidebar view for your music library
- Status bar integration showing currently playing track
- Real-time updates via Server-Sent Events (SSE)

## Requirements

To use this extension, you only need to have **Clispot Core** installed on your system.

**Install Clispot Core**: Follow the [installation guide](https://clispot-docs.vercel.app/core/installation/)

The extension will automatically start Clispot Core in the background when you open VS Code. On first launch, you'll be prompted to authenticate with your Spotify account.


## Getting Started

1. Install the extension from the VS Code Marketplace
2. Ensure Clispot Core is installed on your system
3. Open VS Code - the extension will automatically start Clispot Core
4. Authenticate with Spotify when prompted (first time only)
5. Click on the Clispot icon in the Activity Bar to browse your library

## Available Commands

Access these commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Clispot: Toggle Play/Pause** - Play or pause the current track
- **Clispot: Play Next Track** - Skip to the next track in the queue
- **Clispot: Play Previous Track** - Go back to the previous track
- **Clispot: Refresh Library** - Manually refresh your music library

## Extension Settings

This extension currently does not contribute any VS Code settings. Configuration is managed through Clispot Core.

## Known Issues

- The extension requires Clispot Core to be running. If you encounter connection issues, ensure Clispot is running on `http://localhost:8282`
- Real-time status updates require an active SSE connection

## Release Notes

### 0.0.1

Initial release of Clispot VS Code Extension:
- Library browsing (playlists, artists, liked songs)
- Search functionality
- Playback controls
- Queue management
- Status bar integration

## For More Information

- [Full Documentation](https://clispot-docs.vercel.app/)
- [VS Code Extension Guide](https://clispot-docs.vercel.app/vscode-extension/quickstart/)
- [Clispot Core Documentation](https://clispot-docs.vercel.app/core/installation/)
- [Report Issues](https://github.com/Kumneger0/clispot-vscode-extension/issues)

## License

This project is licensed under the MIT License.

**Enjoy your music while you code! 🎵**

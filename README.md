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

Before using this extension, you need to have **Clispot Core** installed and running:

1. **Install Clispot Core**: Follow the [installation guide](https://clispot-docs.vercel.app/core/installation/)
2. **Authenticate with Spotify**: Run `clispot` in your terminal and authenticate with your Spotify account
3. **Start Clispot**: The extension requires Clispot to be running (it starts automatically when you run `clispot`)

> **Note**: This extension requires an active Spotify Premium subscription.

## Getting Started

1. Install the extension from the VS Code Marketplace
2. Ensure Clispot Core is installed and authenticated
3. Click on the Clispot icon in the Activity Bar to open your library
4. Start browsing and controlling your music!

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

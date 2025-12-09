# Change Log

All notable changes to the "clispot" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [0.0.2] - 2025-12-09

### Added
- Added `clispot.playNextTrack` command to skip to next track
- Added `clispot.playPreviousTrack` command to go back to previous track
- Added `clispot.refreshLibrary` command to manually refresh the library
- Added extension icon

### Changed
- Updated README with comprehensive documentation
- Updated documentation links to point to official docs site (https://clispot-docs.vercel.app/)
- Corrected default port in documentation to `http://localhost:8282`
- Added publisher and repository information to package.json
- Excluded webview-ui source files from extension package

## [0.0.1] - 2025-12-09

### Added
- Initial release of Clispot VS Code Extension
- Library browsing (playlists, artists, liked songs)
- Search functionality for tracks, albums, artists, and playlists
- Playback controls (play/pause)
- Queue management
- Status bar integration showing currently playing track
- Real-time updates via Server-Sent Events (SSE)
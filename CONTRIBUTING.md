# Contributing to clispot-vscode-extension

Working on the VS Code extension involves both the extension backend (TypeScript) and the Webview UI (Svelte 5).

## Development Setup

1. **Fork and Clone**:
   - Fork the [clispot-vscode-extension](https://github.com/Kumneger0/clispot-vscode-extension) repository.
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/clispot-vscode-extension.git
     cd clispot-vscode-extension
     ```

2. **Prerequisites**:
   - Node.js and npm.
   - VS Code.
   - **Clispot CLI**: The extension requires the `clispot` binary to be in your PATH. You also need valid Spotify credentials (see [Core Contributing Guide](../core/CONTRIBUTING.md)).

3. **Installation**:

   ```bash
   npm install
   ```

4. **Running the Extension**:
   - Open the `vscode-extension` folder in VS Code.
   - Press `F5` to open a new "Extension Development Host" window.

5. **Webview Development**:
   - The UI is located in `webview-ui`.
   ```bash
   cd webview-ui
   npm run dev
   ```

## Code Style

- Use Prettier for formatting.
- Ensure TypeScript types are correctly defined.

## Submitting Changes

- Create a descriptive branch name.
- Ensure the extension builds correctly (`npm run compile`).
- Submit a PR with a summary of your changes.

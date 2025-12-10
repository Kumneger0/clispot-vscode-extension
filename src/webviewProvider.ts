import * as vscode from 'vscode';
import { getLibrary, getTracks, Search } from './api.js';
import { getMusicQueue } from './extension.js';

export class ClispotWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'clispotLibrary';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
  ) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,

      localResourceRoots: [
        this._extensionUri
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'getLibrary': 
            {
                try {
                const library = await getLibrary();
                webviewView.webview.postMessage({ type: 'libraryData', data: library });
                } catch (e) {
                vscode.window.showErrorMessage('Failed to fetch library');
                }
                break;
            }
        case 'getTracks': 
            {
                try {
                    const response = await getTracks(data.id, data.context);
                  webviewView.webview.postMessage({ type: 'tracksData', context: data.context, data: response.tracks });
                } catch (e) {
                    vscode.window.showErrorMessage('Failed to fetch tracks');
                }
                break;
            }
        case 'playTrack':
            {
            // this block will only be called when the user clicks on a track which means isSkip will be true
            vscode.commands.executeCommand('clispot.playTrackWebview', { ...data, isSkip: true });
            break;
          }
        case 'getMusicQueue':
          {
            try {
              const musicQueue = getMusicQueue();
              webviewView.webview.postMessage({ type: 'musicQueueData', data: musicQueue });
            } catch (e) {
              vscode.window.showErrorMessage('Failed to fetch music queue');
            }
            break;
          }
            
        case "search":
          const query = data.query;
          const response = await Search(query);
          webviewView.webview.postMessage({ type: 'searchResult', data: response });
          break;
      }
    });
  }

  public onQueueChange() {
    this._view?.webview.postMessage({ type: 'musicQueueData', data: getMusicQueue() });
  }

  public onLibraryChange() {
    this._view?.webview.postMessage({ type: 'libraryData', data: getLibrary() });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview', 'assets', 'index.js'));
    const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview', 'assets', 'index.css'));

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Clispot</title>
        <link href="${stylesUri}" rel="stylesheet">
      </head>
      <body>
        <div id="app"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

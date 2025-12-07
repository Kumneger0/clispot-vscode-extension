import { EventSource } from "eventsource"; // Import EventSource
import * as vscode from "vscode";
import { playTrack, togglePlayPause } from "./api.js";
import { MusicQueue, PlayRequestBody } from "./types/types.js";
import { ClispotWebviewProvider } from "./webviewProvider.js";
import { execFile } from "child_process";

let clispotStatusBarItem: vscode.StatusBarItem;
let currentPlayingTrackName: string | undefined;
let terminal: vscode.Terminal | undefined;

let musicQueue: MusicQueue = {
  Items: [],
  currentIndex: 0,
};

const TERMINAL_NAME = "CLISPOT_TUI";
const command = "clispot --headless --disable-cache";

export async function activate(context: vscode.ExtensionContext) {
  if (!(await isClispotInstalled())) {
    const action = await vscode.window.showErrorMessage(
      "Clispot is not installed. Please install it from https://github.com/kumneger0/clispot",
      "Take Me To Install Page"
    );
    if (action === "Take Me To Install Page") {
      vscode.env.openExternal(
        vscode.Uri.parse("https://github.com/Kumneger0/clispot/releases/latest")
      );
    }
    return;
  }

  const existing = vscode.window.terminals.find(
    (t) => t.name === TERMINAL_NAME
  );
  if (existing) {
    existing.show();
    terminal = existing;
  } else {
    const term = vscode.window.createTerminal(TERMINAL_NAME);
    term.sendText(command);
    // term.show();
    terminal = term;
  }

  const isServerUp = await checkServerStatus();
  if (!isServerUp) {
    const action = await vscode.window.showErrorMessage(
      "Failed to start Clispot server. Please try again. If the issue persists, consider opening an issue on our GitHub page: https://github.com/kumneger0/clispot",
      "Open GitHub Page"
    );
    if (action === "Open GitHub Page") {
      vscode.env.openExternal(
        vscode.Uri.parse("https://github.com/Kumneger0/clispot/issues/new")
      );
    }
    return;
  }

  const clispotWebviewProvider = new ClispotWebviewProvider(
    context.extensionUri
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "clispotLibrary",
      clispotWebviewProvider
    )
  );

  vscode.commands.registerCommand(
    "clispot.playTrackWebview",
    async (data: {
      trackId: string;
      contextUri: string;
      index: number;
      tracks: any[];
    }) => {
      const items = data.tracks;
      const currentIndex = data.index;

      const trackObj = items[currentIndex];
      if (!trackObj || !trackObj.track) {
        vscode.window.showInformationMessage(
          "Could not play the selected item. Please select a valid track."
        );
        return;
      }

      const track = trackObj.track;
      const artists = track.artists?.map((a: any) => a.name);
      const requestBody: PlayRequestBody = {
        trackID: track.id,
        name: track.name,
        artists: artists,
        album: track.album.name,
      };
      try {
        await playTrack(requestBody);
        musicQueue = {
          Items: items,
          currentIndex,
        };
        vscode.window.showInformationMessage(
          `Playing: ${track.name} by ${artists.join(", ")}`
        );

        currentPlayingTrackName = `${track.name} - ${artists.join(", ")}`;
        clispotStatusBarItem.text = `$(play) ${currentPlayingTrackName}`;
        clispotStatusBarItem.show();
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to play track: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  );

  vscode.commands.registerCommand("clispot.togglePlayPause", async () => {
    try {
      const response = await togglePlayPause();
      if (response.action === "paused") {
        clispotStatusBarItem.text = `$(debug-pause) Paused`;
      } else {
        clispotStatusBarItem.text = `$(play) ${
          currentPlayingTrackName || "Playing..."
        }`;
      }
      vscode.window.showInformationMessage(`Player: ${response.action}`);
      clispotStatusBarItem.show();
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to toggle play/pause: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  });

  clispotStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  clispotStatusBarItem.command = "clispot.togglePlayPause";
  clispotStatusBarItem.text = `$(debug-pause) Clispot (Paused)`;
  clispotStatusBarItem.tooltip = "Toggle Play/Pause Clispot";
  context.subscriptions.push(clispotStatusBarItem);
  clispotStatusBarItem.show();

  const eventSource = new EventSource("http://localhost:8282/events");
  eventSource.onopen = () => console.log("SSE connected");
  eventSource.onerror = (err) => console.error("SSE error:", err);
  eventSource.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.seconds !== undefined) {
        const item = musicQueue.Items[musicQueue.currentIndex];

        if (item?.track) {
          const totalDurationInSeconds = item.track.duration_ms / 1000;
          const diff = totalDurationInSeconds - Number(data.seconds);

          if (diff < 3) {
            const nextTrack = musicQueue.Items[musicQueue.currentIndex + 1];
            if (!nextTrack) {
              return;
            }
            const track = nextTrack.track;
            const artists = track.artists?.map((a) => a.name);
            const requestBody: PlayRequestBody = {
              trackID: track.id,
              name: track.name,
              artists: artists,
              album: track.album.name,
            };

            await playTrack(requestBody);
            musicQueue.currentIndex = musicQueue.currentIndex + 1;
            vscode.window.showInformationMessage(
              `Playing: ${track.name} by ${artists.join(", ")}`
            );

            currentPlayingTrackName = `${track.name} - ${artists.join(", ")}`;
            clispotStatusBarItem.text = `$(play) ${currentPlayingTrackName}`;
            clispotStatusBarItem.show();
          }
        }

        const minutes = Math.floor(data.seconds / 60);
        const seconds = Math.floor(data.seconds % 60);
        const formattedTime = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
        if (currentPlayingTrackName) {
          clispotStatusBarItem.text = `$(play) ${currentPlayingTrackName} [${formattedTime}]`;
        } else {
          clispotStatusBarItem.text = `$(play) Playing... [${formattedTime}]`;
        }
      }
    } catch (e) {
      console.error("Failed to parse SSE message:", e);
    }
  };
  context.subscriptions.push(new vscode.Disposable(() => eventSource.close()));
}

export function deactivate() {
  clispotStatusBarItem.dispose();
  terminal?.dispose();
}

async function isClispotInstalled() {
  return await new Promise<boolean>((resolve) => {
    execFile("clispot", ["version"], (err) => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

async function checkServerStatus() {
  let retryCount = 0;
  return await new Promise<boolean>((resolve) => {
    setInterval(async () => {
      try {
        const response = await fetch("http://localhost:8282");
        if (!response.ok) {
          throw new Error("Failed to check server status");
        }
        resolve(true);
      } catch (error) {
        retryCount++;
        if (retryCount >= 5) {
          resolve(false);
        }
      }
    }, 1000);
  });
}

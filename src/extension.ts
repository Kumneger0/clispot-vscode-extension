import { execFile } from "child_process";
import { EventSource } from "eventsource"; // Import EventSource
import * as vscode from "vscode";
import { getQueue, playTrack, togglePlayPause } from "./api.js";
import {
  MusicQueue,
  PlayRequestBody
} from "./types/types.js";
import { ClispotWebviewProvider } from "./webviewProvider.js";

let clispotStatusBarItem: vscode.StatusBarItem;
let currentPlayingTrackName: string | undefined;
let terminal: vscode.Terminal | undefined;

let musicQueue: MusicQueue = {
  tracks: [],
  currentIndex: 0,
};

const TERMINAL_NAME = "CLISPOT_TUI";
const command = "clispot --headless --disable-cache";

export function getMusicQueueLocal() {
  return musicQueue;
}


export const updateMusicQueueLocal = (newMusicQueue: MusicQueue) => {
  musicQueue = newMusicQueue;
}

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
    term.hide();
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
      index: number;
      tracks: any[];
      isSkip: boolean;
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
        isSkip: data.isSkip,
        queue: {
          tracks: items,
          currentIndex,
        },
      };
      try {
        await playTrack(requestBody);
        musicQueue = {
          tracks: items,
          currentIndex,
        };

        clispotWebviewProvider.onQueueChange();
        vscode.window.showInformationMessage(
          `Playing: ${track.name} by ${artists.join(", ")}`
        );

        currentPlayingTrackName = `${track.name} - ${artists.join(", ")}`;
        clispotStatusBarItem.text = `$(play) ${currentPlayingTrackName}`;
        clispotStatusBarItem.show();
      } catch (error) {
        console.log("error", error);
        vscode.window.showErrorMessage(
          `Failed to play track: ${error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  );

  vscode.commands.registerCommand("clispot.togglePlayPause", async () => {
    try {
      const response = await togglePlayPause();
      if (response.action === "paused") {
        clispotStatusBarItem.text = `${"$(play)"} Paused ${currentPlayingTrackName ? currentPlayingTrackName : ""}`;
      } else {
        clispotStatusBarItem.text = `${"$(debug-pause)"} playing  ${currentPlayingTrackName ? currentPlayingTrackName : ""}`;
      }
      clispotStatusBarItem.show();
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to toggle play/pause: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  });

  vscode.commands.registerCommand("clispot.playNextTrack", async () => {
    try {
      musicQueue.currentIndex++;
      const track = musicQueue.tracks[musicQueue.currentIndex];
      if (!track) {
        vscode.window.showErrorMessage("Failed to Play Next Track");
        return;
      }
      const requestBody: PlayRequestBody = {
        trackID: track.track.id,
        name: track.track.name,
        artists: track.track.artists?.map((a) => a.name),
        album: track.track.album.name,
        isSkip: true,
        queue: {
          tracks: musicQueue.tracks,
          currentIndex: musicQueue.currentIndex,
        },
      };
      await playTrack(requestBody);
      clispotWebviewProvider.onQueueChange();
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to play next track: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  });

  vscode.commands.registerCommand("clispot.playPreviousTrack", async () => {
    try {
      musicQueue.currentIndex--;
      const previousTrack = musicQueue.tracks[musicQueue.currentIndex];
      if (!previousTrack) {
        vscode.window.showErrorMessage("Failed to Play Previous Track");
        return;
      }
      const requestBody: PlayRequestBody = {
        trackID: previousTrack.track.id,
        name: previousTrack.track.name,
        artists: previousTrack.track.artists?.map((a) => a.name),
        album: previousTrack.track.album.name,
        isSkip: true,
        queue: {
          tracks: musicQueue.tracks,
          currentIndex: musicQueue.currentIndex,
        },
      };
      await playTrack(requestBody);
      clispotWebviewProvider.onQueueChange();
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to play previous track: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  });

  vscode.commands.registerCommand("clispot.refreshLibrary", async () => {
    try {
      clispotWebviewProvider.onLibraryChange();
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to refresh library: ${error instanceof Error ? error.message : String(error)
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

      if (musicQueue.tracks.length === 0 || !musicQueue.currentIndex) {
        const newMusicQueue = await getQueue();
        if (newMusicQueue) {
          musicQueue = newMusicQueue;
          clispotWebviewProvider.onQueueChange();
        }
      }

      if (data.currentIndex && data.currentIndex !== musicQueue.currentIndex) {
        musicQueue.currentIndex = data.currentIndex;
        clispotWebviewProvider.onQueueChange();
      }
      if (data.seconds !== undefined) {
        const item = musicQueue.tracks[musicQueue.currentIndex];

        if (item?.track) {
          const totalDurationInSeconds = item.track.duration_ms / 1000;
          const diff = totalDurationInSeconds - Number(data.seconds);

          if (diff < 3) {
            const nextTrack = musicQueue.tracks[musicQueue.currentIndex + 1];
            if (!nextTrack) {
              return;
            }

            vscode.commands.executeCommand("clispot.playTrackWebview", {
              trackId: nextTrack.track.id,
              index: musicQueue.currentIndex + 1,
              tracks: musicQueue.tracks,
              isSkip: false,
            });
          }
        }

        currentPlayingTrackName = item?.track?.name;
        const isPlaying = data.isPlaying;
        const minutes = Math.floor(data.seconds / 60);
        const seconds = Math.floor(data.seconds % 60);
        const formattedTime = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;

        if (!isPlaying) {
          clispotStatusBarItem.text = `${"$(play)"} Paused ${currentPlayingTrackName ? currentPlayingTrackName : ""
            } [${formattedTime}]`;
        } else {
          clispotStatusBarItem.text = `${"$(debug-pause)"} playing  ${currentPlayingTrackName ? currentPlayingTrackName : " "
            } [${formattedTime}]`;
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

import * as vscode from "vscode";
import { ClispotTreeDataProvider } from "./treeDataProvider";
import { playTrack, togglePlayPause } from "./api";
import { MusicQueue, PlayRequestBody, PlaylistTrackObject } from "./types";
import { EventSource } from "eventsource"; // Import EventSource

let clispotStatusBarItem: vscode.StatusBarItem;
let currentPlayingTrackName: string | undefined;

let musicQueue: MusicQueue = {
  Items: [],
  currentIndex: 0,
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "clispot" is now active!');

  const clispotTreeDataProvider = new ClispotTreeDataProvider();
  vscode.window.registerTreeDataProvider(
    "clispotLibrary",
    clispotTreeDataProvider
  );

  vscode.commands.registerCommand("clispot.refreshLibrary", () =>
    clispotTreeDataProvider.refresh()
  );

  vscode.commands.registerCommand("clispot.search", async () => {
    const query = await vscode.window.showInputBox({
      placeHolder: "Search for a track, artist, or album",
      prompt: "Enter your search query",
    });

    if (query) {
      vscode.window.showInformationMessage(`You searched for: ${query}`);
    }
  });

  vscode.commands.registerCommand(
    "clispot.playTrack",
    async (currentIndex: number, items: PlaylistTrackObject[]) => {
      const trackObj = items[currentIndex];
      if (!trackObj || !trackObj.track) {
        vscode.window.showInformationMessage(
          "Could not play the selected item. Please select a valid track."
        );
        return;
      }

      const track = trackObj.track;
      const artists = track.artists.map((a) => a.name);
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
            const artists = track.artists.map((a) => a.name);
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
}

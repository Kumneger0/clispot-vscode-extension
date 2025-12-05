import * as vscode from "vscode";
import * as path from "path";
import { getLibrary, getTracks } from "./api";
import {
  UserLibrary,
  Playlist,
  Artist,
  PlaylistTrackObject,
  TracksType,
} from "./types";

type TreeItemType = "category" | "playlist" | "artist" | "track";

export class ClispotTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly type: TreeItemType,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly id?: string,
    public readonly contextValue?: string,
    public readonly trackData?: PlaylistTrackObject,
    command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.id = id;
    this.contextValue = contextValue;
    this.command = command;

    this.iconPath = {
      light: vscode.Uri.file(
        path.join(
          __filename,
          "..",
          "..",
          "resources",
          "light",
          `${this.type}.svg`
        )
      ),
      dark: vscode.Uri.file(
        path.join(
          __filename,
          "..",
          "..",
          "resources",
          "dark",
          `${this.type}.svg`
        )
      ),
    };
  }
}

export class ClispotTreeDataProvider
  implements vscode.TreeDataProvider<ClispotTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    ClispotTreeItem | undefined | void
  > = new vscode.EventEmitter<ClispotTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ClispotTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ClispotTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ClispotTreeItem): Promise<ClispotTreeItem[]> {
    if (!element) {
      return [
        new ClispotTreeItem(
          "Saved Tracks",
          "category",
          vscode.TreeItemCollapsibleState.Collapsed,
          "saved_tracks"
        ),
        new ClispotTreeItem(
          "Playlists",
          "category",
          vscode.TreeItemCollapsibleState.Collapsed,
          "playlists"
        ),
        new ClispotTreeItem(
          "Artists",
          "category",
          vscode.TreeItemCollapsibleState.Collapsed,
          "artists"
        ),
      ];
    }

    if (element.id === "saved_tracks") {
      const tracksResponse = await getTracks(element.id, "saved_tracks");
      if (!tracksResponse) {
        vscode.window.showErrorMessage(
          `Failed to load tracks for artist ${element.label}.`
        );
        return [];
      }
      return tracksResponse.tracks.map(
        (trackObj, currentIndex, arr) =>
          new ClispotTreeItem(
            `${trackObj.track.name} - ${trackObj.track.artists
              .map((a) => a.name)
              .join(", ")}`,
            "track",
            vscode.TreeItemCollapsibleState.None,
            trackObj.track.id,
            "track",
            trackObj,
            {
              command: "clispot.playTrack",
              title: "Play Track",
              arguments: [currentIndex, arr],
            }
          )
      );
    }
    if (element.type === "category") {
      const library = await getLibrary();
      if (!library) {
        vscode.window.showErrorMessage(
          "Failed to load library data. Is the backend running?"
        );
        return [];
      }

      if (element.id === "playlists") {
        return library.playlist.map(
          (playlist: Playlist) =>
            new ClispotTreeItem(
              playlist.name,
              "playlist",
              vscode.TreeItemCollapsibleState.Collapsed,
              playlist.id,
              "playlist"
            )
        );
      }
      if (element.id === "artists") {
        return library.artist.map(
          (artist: Artist) =>
            new ClispotTreeItem(
              artist.name,
              "artist",
              vscode.TreeItemCollapsibleState.Collapsed,
              artist.id,
              "artist"
            )
        );
      }
    }

    if (element.type === "playlist" && element.id) {
      const tracksResponse = await getTracks(element.id, "playlist");
      if (!tracksResponse) {
        vscode.window.showErrorMessage(
          `Failed to load tracks for playlist ${element.label}.`
        );
        return [];
      }
      return tracksResponse.tracks.map(
        (trackObj, currentIndex, arr) =>
          new ClispotTreeItem(
            `${trackObj.track.name} - ${trackObj.track.artists
              .map((a) => a.name)
              .join(", ")}`,
            "track",
            vscode.TreeItemCollapsibleState.None,
            trackObj.track.id,
            "track",
            trackObj,
            {
              command: "clispot.playTrack",
              title: "Play Track",
              arguments: [currentIndex, arr],
            }
          )
      );
    }

    if (element.type === "artist" && element.id) {
      const tracksResponse = await getTracks(element.id, "followed_artist");
      if (!tracksResponse) {
        vscode.window.showErrorMessage(
          `Failed to load tracks for artist ${element.label}.`
        );
        return [];
      }
      return tracksResponse.tracks.map(
        (trackObj, currentIndex, arr) =>
          new ClispotTreeItem(
            `${trackObj.track.name} - ${trackObj.track.artists
              .map((a) => a.name)
              .join(", ")}`,
            "track",
            vscode.TreeItemCollapsibleState.None, 
            trackObj.track.id,
            "track", 
            trackObj,
            {
              command: "clispot.playTrack",
              title: "Play Track",
              arguments: [currentIndex, arr], 
            }
          )
      );
    }

    return [];
  }
}

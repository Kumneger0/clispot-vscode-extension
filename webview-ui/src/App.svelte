<script module lang="ts">
  import type {
      Album,
      Artist,
      MusicQueue,
      Playlist,
      PlaylistTrackObject,
      SearchResponse,
      TracksType,
      UserLibrary,
  } from "../../src/types/types.js";

  import type { WebviewApi } from "vscode-webview";

  declare const acquireVsCodeApi: () => WebviewApi<{}>;
  const vscode = acquireVsCodeApi();
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import LibraryList from "./components/LibraryList.svelte";
  import Navigation from "./components/Navigation.svelte";
  import Queue from "./components/Queue.svelte";
  import Search from "./components/Search.svelte";
  import TrackDetailView from "./components/TrackDetailView.svelte";
  import TrackList from "./components/TrackList.svelte";

  let activeTab = $state<
    | "saved_tracks"
    | "playlists"
    | "artists"
    | "album"
    | "album_view"
    | "playlist_view"
    | "artist_view"
    | "search"
    | "queue"
  >("saved_tracks");
  let library = $state<UserLibrary & { savedTracks: PlaylistTrackObject[] }>({
    playlist: [],
    artist: [],
    album: [],
    savedTracks: [],
  });

  //this tracks can take any tracks whether from playlist, artist, album
  let tracks = $state<PlaylistTrackObject[]>([]);
  let loading = $state(false);

  let searchQuery = $state("");
  let searchResults = $state<SearchResponse | null>(null);
  let isSearching = $state(false);

  let musicQueue = $state<MusicQueue | null>(null);
  let alreadyPlayedTracks = $state<PlaylistTrackObject[]>([]);

  let currentlyPlayingTrack = $derived(
    musicQueue?.tracks[musicQueue?.currentIndex] || null,
  );

  onMount(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      console.log(message);
      switch (message.type) {
        case "libraryData":
          library = { savedTracks: library.savedTracks, ...message.data };
          break;
        case "tracksData":
          if (message.context && message.context === "saved_tracks") {
            library = { ...library, savedTracks: message.data };
            loading = false;
          } else {
            tracks = message.data;
            loading = false;
          }
          break;
        case "searchResult":
          searchResults = message.data;
          isSearching = false;
          break;
        case "musicQueueData":
          updateAlreadyPlayedTracks(currentlyPlayingTrack);
          musicQueue = message.data;
          break;
      }
    });

    vscode.postMessage({ type: "getLibrary" });
    loadTracks("saved_tracks", "saved_tracks");
  });

  function loadTracks(id: string, type: TracksType) {
    loading = true;
    tracks = [];
    vscode.postMessage({ type: "getTracks", id, context: type });
  }

  function updateAlreadyPlayedTracks(trackToAdd?: PlaylistTrackObject | null) {
    if (!trackToAdd) {
      return;
    }
    alreadyPlayedTracks = [...alreadyPlayedTracks, trackToAdd]?.filter(
      (track, i, arr) =>
        arr.findIndex((t) => t?.track?.id == track?.track?.id) === i,
    );
  }

  function playTrack(
    trackId: string,
    index: number,
    tracksList: PlaylistTrackObject[],
  ) {
    const trackToAdd = musicQueue?.tracks[musicQueue?.currentIndex];
    if (trackToAdd) updateAlreadyPlayedTracks(trackToAdd);
    musicQueue = { tracks: tracksList, currentIndex: index };
    const data = {
      type: "playTrack",
      trackId,
      index,
      tracks: JSON.parse(JSON.stringify(tracksList)),
    };

    vscode.postMessage(data);
  }

  function addToQueue(track: PlaylistTrackObject) {
    let index =
      musicQueue?.tracks.filter((track) => track.isItFromQueue)?.length || 0;
    //add 1 to add the current track after previoully added
    // the clispot core used append(tracks[:index], {this-track}, tracks[index:])
    const currentIndex = (musicQueue?.currentIndex || 0) + index + 1;

    vscode.postMessage({
      type: "addTrackToQueue",
      track: track,
      index: currentIndex,
    });
  }

  function removeFromQueue(track: PlaylistTrackObject) {
    vscode.postMessage({ type: "removeTrackFromQueue", track: track });
  }

  function handleSearch() {
    if (!searchQuery.trim()) return;
    isSearching = true;
    searchResults = null;
    vscode.postMessage({ type: "search", query: searchQuery });
  }
</script>

<main
  class="h-screen flex flex-col bg-zinc-950 text-white selection:bg-green-500/30 font-sans overflow-hidden"
>
  <Navigation bind:activeTab onLoadTracks={loadTracks} />

  <div class="flex-1 overflow-y-auto w-full scrollbar-hide">
    {#if activeTab === "saved_tracks"}
      {#if loading && library?.savedTracks?.length === 0}
        <div class="flex items-center justify-center p-8">
          <p class="text-zinc-500 animate-pulse text-xs">Loading...</p>
        </div>
      {:else if library?.savedTracks?.length === 0}
        <div class="flex flex-col items-center justify-center p-8 text-center">
          <p class="text-zinc-400 text-sm mb-1">No tracks</p>
        </div>
      {:else}
        <TrackList
          {currentlyPlayingTrack}
          tracks={library.savedTracks}
          {playTrack}
          {addToQueue}
          {removeFromQueue}
          context="saved_tracks"
        />
      {/if}
    {/if}

    {#if activeTab === "playlists"}
      <LibraryList
        items={library.playlist || []}
        type="playlist"
        onSelect={(item) => {
          activeTab = "playlist_view";
          loadTracks((item as Playlist).id, "playlist");
        }}
      />
    {/if}

    {#if activeTab === "artists"}
      <LibraryList
        items={library.artist || []}
        type="artist"
        onSelect={(item) => {
          activeTab = "artist_view";
          loadTracks((item as Artist).id, "followed_artist");
        }}
      />
    {/if}

    {#if activeTab === "album"}
      <LibraryList
        items={library.album || []}
        type="album"
        onSelect={(item) => {
          activeTab = "album_view";
          loadTracks((item as Album).id, "album_tracks");
        }}
      />
    {/if}

    {#if activeTab === "playlist_view" || activeTab === "artist_view" || activeTab === "album_view"}
      <TrackDetailView
        {currentlyPlayingTrack}
        {tracks}
        {playTrack}
        {loading}
        {addToQueue}
        {removeFromQueue}
        context="todo_context"
        onBack={() => {
          let nextTab: "playlists" | "artists" | "album" =
            activeTab === ("playlist_view" as const)
              ? ("playlists" as const)
              : ("artists" as const);
          if (activeTab === "album_view") nextTab = "album" as const;
          activeTab = nextTab;
        }}
      />
    {/if}

    {#if activeTab === "search"}
      <Search
        {currentlyPlayingTrack}
        bind:searchQuery
        {searchResults}
        {isSearching}
        {handleSearch}
        {playTrack}
        {tracks}
        {loadTracks}
        {loading}
        {addToQueue}
        {removeFromQueue}
      />
    {/if}

    {#if activeTab === "queue"}
      <Queue
        {currentlyPlayingTrack}
        {musicQueue}
        {playTrack}
        onBack={() => (activeTab = "saved_tracks")}
        playedTracks={alreadyPlayedTracks}
        {removeFromQueue}
      />
    {/if}
  </div>
</main>

<script lang="ts">
  import type {
    SearchResponse,
    PlaylistTrackObject,
    TracksType,
  } from "../../../src/types/types.js";
  import LibraryList from "./LibraryList.svelte";
  import TrackList from "./TrackList.svelte";
  import TrackDetailView from "./TrackDetailView.svelte";

  interface Props {
    searchQuery: string;
    searchResults: SearchResponse | null;
    isSearching: boolean;
    handleSearch: () => void;
    tracks: PlaylistTrackObject[];
    playTrack: (
      trackId: string,
      contextUri: string,
      index: number,
      tracksList: PlaylistTrackObject[],
    ) => void;
    loadTracks: (itemId: string, type: TracksType) => void;
    currentlyPlayingTrack:PlaylistTrackObject | null
    loading?: boolean;
  }

  let {
    searchQuery = $bindable(),
    searchResults,
    isSearching,
    handleSearch,
    tracks,
    playTrack,
    currentlyPlayingTrack,
    loadTracks,
    loading = false,
  }: Props = $props();

  type ActiveTabTypes =
    | "tracks"
    | "playlists"
    | "artists"
    | "albums"
    | "albums_view"
    | "playlists_view"
    | "artists_view";

  let activeTab = $state<ActiveTabTypes>("playlists");


  const tabs :{label: string, value: ActiveTabTypes}[] = [
    { label: "Tracks", value: "tracks" },
    { label: "Playlists", value: "playlists" },
    { label: "Artists", value: "artists" },
    { label: "Albums", value: "albums" },
  ] 




</script>

<div class="p-4 flex flex-col h-full">
  <div class="flex gap-2 mb-4">
    <input
      type="text"
      bind:value={searchQuery}
      onkeydown={(e) => e.key === "Enter" && handleSearch()}
      placeholder="Search..."
      class="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-hidden focus:border-green-500 placeholder-zinc-600 transition-colors"
    />
    <button
      onclick={handleSearch}
      class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-md transition-colors"
    >
      Search
    </button>
  </div>

  {#if isSearching}
    <div class="flex items-center justify-center flex-1">
      <p class="text-zinc-500 animate-pulse text-xs">Searching...</p>
    </div>
  {:else if searchResults}
    <div class="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
      {#each tabs as {label, value}}
        <button
          class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors {activeTab.startsWith(value)
            ? 'bg-white text-black'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}"
          onclick={() => (activeTab = value)}
        >
          {label} ({searchResults[
            value as keyof SearchResponse
          ]?.items?.length || 0})
        </button>
      {/each}
    </div>

    <div class="flex-1 overflow-y-auto min-h-0">
      {#if activeTab === "tracks" && searchResults.tracks.items?.length}
        <TrackList
          tracks={searchResults.tracks.items.map((track) => ({ track }))}
          {playTrack}
          context="todo_context"
          {currentlyPlayingTrack}
        />
      {:else if (activeTab === "artists" || activeTab == "artists_view") && searchResults.artists.items?.length}
        {#if activeTab == "artists_view"}
          <TrackDetailView
            {tracks}
            {playTrack}
            {loading}
            context="todo_context"
            onBack={() => (activeTab = "artists")}
            {currentlyPlayingTrack}
          />
        {:else}
          <LibraryList
            items={searchResults.artists.items}
            type="artist"
            onSelect={(item) => {
              activeTab = "artists_view";
              loadTracks(item.id, "followed_artist");
            }}
          />
        {/if}
      {:else if (activeTab === "albums" || activeTab == "albums_view") && searchResults.albums.items?.length}
        {#if activeTab == "albums_view"}
          <TrackDetailView
            {tracks}
            {playTrack}
            {loading}
            context="todo_context"
            {currentlyPlayingTrack}
            onBack={() => (activeTab = "albums")}
          />
        {:else}
          <LibraryList
            items={searchResults.albums.items}
            type="album"
            onSelect={(item) => {
              activeTab = "albums_view";
              loadTracks(item.id, "album_tracks");
            }}
          />
        {/if}
      {:else if (activeTab === "playlists" || activeTab == "playlists_view") && searchResults.playlists.items?.length}
        {#if activeTab == "playlists_view"}
          <TrackDetailView
            {currentlyPlayingTrack}
            {tracks}
            {playTrack}
            {loading}
            context="todo_context"
            onBack={() => (activeTab = "playlists")}
          />
        {:else}
          <LibraryList
            items={searchResults.playlists.items}
            type="playlist"
            onSelect={(item) => {
              activeTab = "playlists_view";
              loadTracks(item.id, "playlist");
            }}
          />
        {/if}
      {/if}
    </div>
  {/if}
</div>

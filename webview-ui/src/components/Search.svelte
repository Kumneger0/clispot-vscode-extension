<script lang="ts">
  import type {
    SearchResponse,
    PlaylistTrackObject,
    TracksType,
  } from "../../../src/types/types.js";
  import LibraryList from "./LibraryList.svelte";

  interface Props {
    searchQuery: string;
    searchResults: SearchResponse | null;
    isSearching: boolean;
    handleSearch: () => void;
    searchCategory: "tracks" | "artists" | "albums" | "playlists";
    playTrack: (
      trackId: string,
      contextUri: string,
      index: number,
      tracksList: PlaylistTrackObject[],
    ) => void;
    loadTracks: (itemId: string, type: TracksType) => void;
  }

  let {
    searchQuery = $bindable(),
    searchResults,
    isSearching,
    handleSearch,
    searchCategory = $bindable(),
    playTrack,
    loadTracks,
  }: Props = $props();
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
      {#each ["tracks", "artists", "albums", "playlists"] as cat}
        <button
          class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors {searchCategory ===
          cat
            ? 'bg-white text-black'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}"
          onclick={() => (searchCategory = cat as any)}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)} ({searchResults[
            cat as keyof SearchResponse
          ]?.total || 0})
        </button>
      {/each}
    </div>

    <div class="flex-1 overflow-y-auto min-h-0">
      {#if searchCategory === "tracks" && searchResults.tracks.items?.length}
        <div class="divide-y divide-zinc-900/50">
          {#each searchResults.tracks.items as track, i}
            <button
              class="w-full group flex items-center space-x-3 p-3 hover:bg-white/5 transition-colors duration-200 text-left"
              onclick={() =>
                playTrack(
                  track.id,
                  "search_context",
                  i,
                  searchResults?.tracks.items?.map((t) => ({ track: t })) ?? [],
                )}
            >
              <div
                class="w-8 h-8 flex-none bg-zinc-800 rounded-sm flex items-center justify-center text-zinc-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                  />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <span
                  class="block text-sm font-medium text-zinc-200 truncate group-hover:text-green-400"
                  >{track.name}</span
                >
                <span class="block text-xs text-zinc-500 truncate"
                  >{track.artists?.map((a) => a.name).join(", ")}</span
                >
              </div>
            </button>
          {/each}
        </div>
      {:else if searchCategory === "artists" && searchResults.artists.items?.length}
      <LibraryList items={searchResults.artists.items} type="artist" onSelect={(item) => {
        loadTracks(item.id, "followed_artist");
      }} />
      {:else if searchCategory === "albums" && searchResults.albums.items?.length}
        <LibraryList
          items={searchResults.albums.items}
          type="album"
          onSelect={(item) => {
            loadTracks(item.id, "album");
          }}
        />
      {:else if searchCategory === "playlists" && searchResults.playlists.items?.length}
        <LibraryList items={searchResults.playlists.items} type="playlist" onSelect={(item) => {
          loadTracks(item.id, "playlist");
        }} />
      {/if}
    </div>
  {/if}
</div>

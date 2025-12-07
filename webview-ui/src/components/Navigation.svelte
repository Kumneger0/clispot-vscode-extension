<script lang="ts">
    import type { TracksType } from "../../../src/types/types";

  interface Props {
    activeTab: string;
    onLoadTracks: (id: string, type: TracksType) => void;
  }

  let { activeTab = $bindable(), onLoadTracks }: Props = $props();
</script>

<div
  class="flex-none px-2 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-2"
>
  <div class="flex flex-1 gap-2">
    <button
      class="flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 truncate {activeTab ===
      'saved_tracks'
        ? 'bg-zinc-800 text-white'
        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}"
      onclick={() => {
        activeTab = "saved_tracks";
        onLoadTracks("saved_tracks", "saved_tracks");
      }}>Tracks</button
    >
    <button
      class="flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 truncate {activeTab ===
        'playlists' || activeTab === 'playlist_view'
        ? 'bg-zinc-800 text-white'
        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}"
      onclick={() => (activeTab = "playlists")}>Playlists</button
    >
    <button
      class="flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 truncate {activeTab ===
        'artists' || activeTab === 'artist_view'
        ? 'bg-zinc-800 text-white'
        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}"
      onclick={() => (activeTab = "artists")}>Artists</button
    >
    <button
      class="flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 truncate {activeTab ===
        'album' || activeTab === 'album_view'
        ? 'bg-zinc-800 text-white'
        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}"
      onclick={() => (activeTab = "album")}>Albums</button
    >
  </div>

  <button
    class="p-2 rounded-md transition-colors {activeTab === 'search'
      ? 'text-white bg-zinc-800'
      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}"
    onclick={() => (activeTab = "search")}
    title="Search"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  </button>
</div>

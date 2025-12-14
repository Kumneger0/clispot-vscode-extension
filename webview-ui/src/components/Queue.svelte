<script lang="ts">
  import type { MusicQueue, PlaylistTrackObject } from "../../../src/types/types.js";

  let {
    musicQueue,
    playTrack,
    onBack,
    playedTracks
  }: {
    musicQueue: MusicQueue | null;
    playedTracks: PlaylistTrackObject[];
    playTrack: (trackId: string, index: number, tracksList: PlaylistTrackObject[]) => void;
    onBack: () => void;
  } = $props();


  const filteredPlayedTracks = $derived(playedTracks.filter((track) => track.track.id !== musicQueue?.Items[musicQueue?.currentIndex]?.track.id))
  
  function handleTrackClick(index: number, items:PlaylistTrackObject[]) {
    const track = items[index]
    if (track?.track) {
      playTrack(track.track.id, index, items);
    }
  }

  function formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
</script>

<div class="flex flex-col h-full bg-zinc-950">
  <!-- Header -->
  <div class="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 z-10">
    <div class="flex items-center gap-3 p-3">
      <button
        onclick={onBack}
        class="p-1.5 hover:bg-zinc-800 rounded-full transition-colors"
        aria-label="Back"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1">
        <h2 class="text-base font-semibold">Queue</h2>
        {#if musicQueue}
          <p class="text-xs text-zinc-400">{musicQueue.Items.length} tracks</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto scrollbar-hide">
    {#if !musicQueue || musicQueue.Items.length === 0}
      <div class="flex flex-col items-center justify-center p-8 text-center h-full">
        <svg class="w-12 h-12 text-zinc-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <p class="text-zinc-400 text-sm">No tracks in queue</p>
        <p class="text-zinc-600 text-xs mt-1">Play a track to see it here</p>
      </div>
    {:else}
      {#if musicQueue.currentIndex >= 0 && musicQueue.Items[musicQueue.currentIndex]}
        {@const currentTrack = musicQueue.Items[musicQueue.currentIndex]}
        <div class="p-3 bg-gradient-to-b from-green-950/20 to-transparent border-b border-zinc-800">
          <p class="text-xs text-green-400 font-medium mb-2 flex items-center gap-1">
            <span class="inline-block w-1 h-1 rounded-full bg-green-400 animate-pulse"></span>
            Now Playing
          </p>
          <div class="flex gap-3">
            {#if currentTrack.track?.album?.images?.[0]?.url}
              <img
                src={currentTrack.track.album.images[0].url}
                alt={currentTrack.track.name}
                class="w-12 h-12 rounded shadow-lg"
              />
            {:else}
              <div class="w-12 h-12 rounded bg-zinc-800 flex items-center justify-center">
                <svg class="w-5 h-5 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            {/if}
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate text-white">{currentTrack.track?.name || "Unknown"}</p>
              <p class="text-xs text-zinc-400 truncate">
                {currentTrack.track?.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
              </p>
            </div>
          </div>
        </div>
      {/if}

      {#if musicQueue.currentIndex < musicQueue.Items.length - 1}
        <div class="pt-3 px-3">
          <p class="text-xs text-zinc-500 font-medium mb-2">Up Next</p>
        </div>
        <div class="pb-3">
          {#each musicQueue.Items.slice(musicQueue.currentIndex + 1) as item, idx}
            {@const actualIndex = musicQueue.currentIndex + 1 + idx}
            <button
              onclick={() => handleTrackClick(actualIndex, musicQueue.Items)}
              class="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800/50 transition-colors text-left group"
            >
              <span class="text-xs text-zinc-600 w-5 flex-shrink-0">{actualIndex + 1}</span>
              {#if item.track?.album?.images?.[0]?.url}
                <img
                  src={item.track.album.images[0].url}
                  alt={item.track.name}
                  class="w-10 h-10 rounded shadow-sm"
                />
              {:else}
                <div class="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
              {/if}
              <div class="flex-1 min-w-0">
                <p class="text-sm truncate group-hover:text-green-400 transition-colors">
                  {item.track?.name || "Unknown Track"}
                </p>
                <p class="text-xs text-zinc-500 truncate">
                  {item.track?.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
                </p>
              </div>
              {#if item.track?.duration_ms}
                <span class="text-xs text-zinc-600 flex-shrink-0">
                  {formatDuration(item.track.duration_ms)}
                </span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}

      {#if filteredPlayedTracks.length > 0}
        <details class="border-t border-zinc-800">
          <summary class="px-3 py-2 text-xs text-zinc-500 hover:bg-zinc-900 cursor-pointer select-none">
            Previously Played ({filteredPlayedTracks.length} tracks)
          </summary>
          <div class="pb-3">
            {#each filteredPlayedTracks as item, idx}
              <button
                onclick={() => handleTrackClick(idx, filteredPlayedTracks)}
                class="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800/50 transition-colors text-left group opacity-60"
              >
                <span class="text-xs text-zinc-600 w-5 flex-shrink-0">{idx + 1}</span>
                {#if item.track?.album?.images?.[0]?.url}
                  <img
                    src={item.track.album.images[0].url}
                    alt={item.track.name}
                    class="w-10 h-10 rounded shadow-sm"
                  />
                {:else}
                  <div class="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                {/if}
                <div class="flex-1 min-w-0">
                  <p class="text-sm truncate group-hover:text-green-400 transition-colors">
                    {item.track?.name || "Unknown Track"}
                  </p>
                  <p class="text-xs text-zinc-500 truncate">
                    {item.track?.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
                  </p>
                </div>
                {#if item.track?.duration_ms}
                  <span class="text-xs text-zinc-600 flex-shrink-0">
                    {formatDuration(item.track.duration_ms)}
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        </details>
      {/if}
    {/if}
  </div>
</div>

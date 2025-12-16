<script lang="ts">
  import type {
    MusicQueue,
    PlaylistTrackObject,
  } from "../../../src/types/types.js";

  let {
    musicQueue,
    playTrack,
    onBack,
    playedTracks,
    removeFromQueue,
    currentlyPlayingTrack
  }: {
    musicQueue: MusicQueue | null;
    playedTracks: PlaylistTrackObject[];
    playTrack: (
      trackId: string,
      index: number,
      tracksList: PlaylistTrackObject[],
    ) => void;
    onBack: () => void;
    currentlyPlayingTrack: PlaylistTrackObject | null,
    removeFromQueue?: (track: PlaylistTrackObject) => void;
  } = $props();

  const filteredPlayedTracks = $derived(
    playedTracks.filter(
      (track) =>
        track.track.id !==
        musicQueue?.tracks[musicQueue?.currentIndex]?.track.id,
    ),
  );
  const upcomingTracks = $derived(
    musicQueue ? musicQueue.tracks.slice(musicQueue.currentIndex + 1) : [],
  );
  const nextInQueue = $derived(
    upcomingTracks.filter(({ isItFromQueue }) => isItFromQueue),
  );
  const nextFromContext = $derived(
    upcomingTracks.filter(({ isItFromQueue }) => !isItFromQueue),
  );

  function handleTrackClick(track: PlaylistTrackObject) {
    if (track?.track && musicQueue) {
      const index = musicQueue.tracks.indexOf(track);
      if (index !== -1) {
        playTrack(track.track.id, index, musicQueue.tracks);
      }
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
  <div
    class="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 z-10"
  >
    <div class="flex items-center gap-3 p-3">
      <button
        onclick={onBack}
        class="p-1.5 hover:bg-zinc-800 rounded-full transition-colors"
        aria-label="Back"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="flex-1">
        <h2 class="text-base font-semibold">Queue</h2>
        {#if musicQueue}
          <p class="text-xs text-zinc-400">{musicQueue.tracks.length} tracks</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto scrollbar-hide">
    {#if !musicQueue || musicQueue.tracks.length === 0}
      <div
        class="flex flex-col items-center justify-center p-8 text-center h-full"
      >
        <svg
          class="w-12 h-12 text-zinc-700 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <p class="text-zinc-400 text-sm">No tracks in queue</p>
        <p class="text-zinc-600 text-xs mt-1">Play a track to see it here</p>
      </div>
    {:else}
      {#if currentlyPlayingTrack}
        <div
          class="p-3 bg-gradient-to-b from-green-950/20 to-transparent border-b border-zinc-800"
        >
          <p
            class="text-xs text-green-400 font-medium mb-2 flex items-center gap-1"
          >
            <span
              class="inline-block w-1 h-1 rounded-full bg-green-400 animate-pulse"
            ></span>
            Now Playing
          </p>
          <div class="flex gap-3">
            {#if currentlyPlayingTrack?.track?.album?.images?.[0]?.url}
              <img
                src={currentlyPlayingTrack.track.album.images[0].url}
                alt={currentlyPlayingTrack.track.name}
                class="w-12 h-12 rounded shadow-lg"
              />
            {:else}
              <div
                class="w-12 h-12 rounded bg-zinc-800 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-zinc-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                  />
                </svg>
              </div>
            {/if}
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate text-white">
                {currentlyPlayingTrack.track?.name || "Unknown"}
              </p>
              <p class="text-xs text-zinc-400 truncate">
                {currentlyPlayingTrack.track?.artists?.map((a) => a.name).join(", ") ||
                  "Unknown Artist"}
              </p>
            </div>
          </div>
        </div>
      {/if}

      {#if nextInQueue.length > 0}
        <div class="pt-3 px-3">
          <p class="text-xs text-zinc-500 font-medium mb-2">Next In Queue</p>
        </div>
        <div class="pb-3">
          {#each nextInQueue as item}
            <button
              onclick={() => handleTrackClick(item)}
              class="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800/50 transition-colors text-left group relative"
            >
              <div class="w-5 flex-shrink-0 flex items-center justify-center">
                <div class="w-1 h-1 rounded-full bg-green-500"></div>
              </div>
              {#if item.track?.album?.images?.[0]?.url}
                <img
                  src={item.track.album.images[0].url}
                  alt={item.track.name}
                  class="w-10 h-10 rounded shadow-sm"
                />
              {:else}
                <div
                  class="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-zinc-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                    />
                  </svg>
                </div>
              {/if}
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm truncate group-hover:text-green-400 transition-colors"
                >
                  {item.track?.name || "Unknown Track"}
                </p>
                <p class="text-xs text-zinc-500 truncate">
                  {item.track?.artists?.map((a) => a.name).join(", ") ||
                    "Unknown Artist"}
                </p>
              </div>
              {#if item.track?.duration_ms}
                <span class="text-xs text-zinc-600 flex-shrink-0">
                  {formatDuration(item.track.duration_ms)}
                </span>
              {/if}

              {#if removeFromQueue}
                <div
                  class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 shadow-md rounded-full p-1 border border-zinc-700 hover:bg-zinc-800"
                  onclick={(e) => {
                    e.stopPropagation();
                    const trackToRemove: PlaylistTrackObject = {
                      track: { ...JSON.parse(JSON.stringify(item.track)) },
                      isItFromQueue: true,
                    };
                    removeFromQueue(trackToRemove);
                  }}
                  role="button"
                  tabindex="0"
                  onkeydown={(e) => e.key === "Enter" && removeFromQueue(item)}
                  title="Remove from Queue"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-4 h-4 text-zinc-400 hover:text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              {/if}
            </button>
          {/each}
        </div>
      {/if}

      {#if nextFromContext.length > 0}
        <div class="pt-3 px-3">
          <p class="text-xs text-zinc-500 font-medium mb-2">Next Up</p>
        </div>
        <div class="pb-3">
          {#each nextFromContext as item}
            {@const actualIndex = musicQueue.tracks.indexOf(item)}
            <button
              onclick={() => handleTrackClick(item)}
              class="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800/50 transition-colors text-left group relative"
            >
              <span class="text-xs text-zinc-600 w-5 flex-shrink-0"
                >{actualIndex + 1}</span
              >
              {#if item.track?.album?.images?.[0]?.url}
                <img
                  src={item.track.album.images[0].url}
                  alt={item.track.name}
                  class="w-10 h-10 rounded shadow-sm"
                />
              {:else}
                <div
                  class="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-zinc-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                    />
                  </svg>
                </div>
              {/if}
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm truncate group-hover:text-green-400 transition-colors"
                >
                  {item.track?.name || "Unknown Track"}
                </p>
                <p class="text-xs text-zinc-500 truncate">
                  {item.track?.artists?.map((a) => a.name).join(", ") ||
                    "Unknown Artist"}
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
          <summary
            class="px-3 py-2 text-xs text-zinc-500 hover:bg-zinc-900 cursor-pointer select-none"
          >
            Previously Played ({filteredPlayedTracks.length} tracks)
          </summary>
          <div class="pb-3">
            {#each filteredPlayedTracks as item, idx}
              <button
                onclick={() => handleTrackClick(item)}
                class="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800/50 transition-colors text-left group opacity-60"
              >
                <span class="text-xs text-zinc-600 w-5 flex-shrink-0"
                  >{idx + 1}</span
                >
                {#if item.track?.album?.images?.[0]?.url}
                  <img
                    src={item.track.album.images[0].url}
                    alt={item.track.name}
                    class="w-10 h-10 rounded shadow-sm"
                  />
                {:else}
                  <div
                    class="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      class="w-4 h-4 text-zinc-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                      />
                    </svg>
                  </div>
                {/if}
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm truncate group-hover:text-green-400 transition-colors"
                  >
                    {item.track?.name || "Unknown Track"}
                  </p>
                  <p class="text-xs text-zinc-500 truncate">
                    {item.track?.artists?.map((a) => a.name).join(", ") ||
                      "Unknown Artist"}
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

<script lang="ts">
  import type { PlaylistTrackObject } from "../../../src/types/types.js";

  interface Props {
    tracks: PlaylistTrackObject[];
    playTrack: (
      trackId: string,
      index: number,
      tracksList: PlaylistTrackObject[],
    ) => void;
    addToQueue?: (track: PlaylistTrackObject) => void;
    removeFromQueue?: (track: PlaylistTrackObject) => void;
    context:string, 
    currentlyPlayingTrack: PlaylistTrackObject | null,
  }


  let { tracks, playTrack, context = "saved_tracks", currentlyPlayingTrack, addToQueue, removeFromQueue }: Props = $props();
</script>
    

<div class="divide-y divide-zinc-900/50">
  {#each tracks as item, i}
    {@const isPlaying = currentlyPlayingTrack?.track?.id === item.track.id}
    <div
      class="w-full group flex items-center space-x-3 p-3 hover:bg-white/5 transition-colors duration-200 text-left cursor-pointer"
      onclick={() => playTrack(item.track.id, i, tracks)}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && playTrack(item.track.id, i, tracks)}
    >
      <div
        class="w-4 flex-none flex items-center justify-center text-xs font-mono {isPlaying
          ? 'text-green-500'
          : 'text-zinc-600 group-hover:text-green-500'}"
      >
        {#if isPlaying}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-3 h-3"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clip-rule="evenodd"
            />
          </svg>
        {:else}
          <span class="group-hover:hidden">{i + 1}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-3 h-3 hidden group-hover:block"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clip-rule="evenodd"
            />
          </svg>
        {/if}
      </div>

      <div class="flex-1 min-w-0">
        <span
          class="block text-sm font-medium truncate {isPlaying
            ? 'text-green-500'
            : 'text-zinc-200 group-hover:text-green-400'}"
          >{item.track.name}</span
        >
        <span
          class="block text-xs text-zinc-500 truncate mt-0.5 group-hover:text-zinc-400"
          >{item.track.artists?.map((a) => a.name).join(", ")}</span
        >
      </div>

      {#if context === 'queue' && removeFromQueue}
        <button
          class="p-2 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onclick={(e) => {
            e.stopPropagation();
            const trackToRemove:PlaylistTrackObject = {track:{...JSON.parse(JSON.stringify(item.track))}, isItFromQueue: true}
            removeFromQueue(trackToRemove);
          }}
          title="Remove from Queue"
          aria-label="Remove from Queue"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
          </svg>
        </button>
      {:else if context !== 'queue' && addToQueue}
        <button
          class="p-2 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onclick={(e) => {
            e.stopPropagation();
            const trackToAdd:PlaylistTrackObject = {track:{...JSON.parse(JSON.stringify(item.track))}, isItFromQueue: true}
            addToQueue(trackToAdd);
          }}
          title="Add to Queue"
          aria-label="Add to Queue"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
        </button>
      {/if}
    </div>
  {/each}
</div>

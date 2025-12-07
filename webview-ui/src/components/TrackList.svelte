<script lang="ts">
  import type { PlaylistTrackObject } from "../../../src/types/types.js";

  interface Props {
    tracks: PlaylistTrackObject[];
    playTrack: (
      trackId: string,
      contextUri: string,
      index: number,
      tracksList: PlaylistTrackObject[],
    ) => void;
    context?: string;
  }

  let { tracks, playTrack, context = "saved_tracks" }: Props = $props();
</script>
    

<div class="divide-y divide-zinc-900/50">
  {#each tracks as item, i}
    <button
      class="w-full group flex items-center space-x-3 p-3 hover:bg-white/5 transition-colors duration-200 text-left"
      onclick={() => playTrack(item.track.id, context, i, tracks)}
    >
      <div
        class="w-4 flex-none flex items-center justify-center text-zinc-600 group-hover:text-green-500 text-xs font-mono"
      >
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
      </div>

      <div class="flex-1 min-w-0">
        <span
          class="block text-sm font-medium text-zinc-200 truncate group-hover:text-green-400"
          >{item.track.name}</span
        >
        <span
          class="block text-xs text-zinc-500 truncate mt-0.5 group-hover:text-zinc-400"
          >{item.track.artists?.map((a) => a.name).join(", ")}</span
        >
      </div>
    </button>
  {/each}
</div>

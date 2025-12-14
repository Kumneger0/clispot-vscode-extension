<script lang="ts">
  import type { PlaylistTrackObject } from "../../../src/types/types.js";
  import TrackList from "./TrackList.svelte";

  interface Props {
    loading: boolean;
    tracks: PlaylistTrackObject[];
    context?: string;
    playTrack: (
      trackId: string,
      index: number,
      tracksList: PlaylistTrackObject[],
    ) => void;
    onBack?: () => void;
    currentlyPlayingTrack: PlaylistTrackObject | null;
  }

  let {
    loading,
    tracks,
    context = "todo_context",
    playTrack,
    onBack,
    currentlyPlayingTrack,
  }: Props = $props();
</script>

<div
  class="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xs border-b border-zinc-800/50"
>
  {#if onBack}
    <button
      class="w-full flex items-center space-x-2 text-zinc-400 hover:text-white hover:bg-zinc-900 py-3 px-3 transition-all text-sm font-medium"
      onclick={onBack}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span>Back</span>
    </button>
  {/if}
</div>

{#if loading}
  <div class="flex items-center justify-center p-8">
    <p class="text-zinc-500 animate-pulse text-xs">Loading...</p>
  </div>
{:else}
  <TrackList {currentlyPlayingTrack} {tracks} {playTrack} {context} />
{/if}

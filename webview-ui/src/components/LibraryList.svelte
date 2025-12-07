<script lang="ts">
  import type { Playlist, Artist, Album } from "../../../src/types/types";

  type Props = (
    | {
        items: Playlist[];
        type: "playlist";
      }
    | {
        items: Artist[];
        type: "artist";
      }
    | {
        items: Album[];
        type: "album";
      }
  ) & {
    onSelect: (item: Album | Artist | Playlist) => void;
  };

  let { items, type, onSelect }: Props = $props();
</script>

<div class="flex flex-col">
  {#each items as item}
    <button
      class="group flex items-center space-x-3 p-3 border-b border-zinc-900/50 hover:bg-zinc-900 transition-colors duration-200 text-left w-full"
      onclick={() => onSelect(item)}
    >
      {#if type === "playlist"}
        <div
          class="w-10 h-10 bg-zinc-800 rounded-sm flex-none flex items-center justify-center text-zinc-500 group-hover:text-zinc-300"
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
              d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.597l.321-.113v-4.667a9.395 9.395 0 01-3.616 .532v4.25a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.597l.321-.113V8.553z"
            />
          </svg>
        </div>
      {:else if type == "album"}
        <div
          class="flex flex-col gap-2 p-2 hover:bg-white/5 rounded-md transition-colors group"
        >
          <div
            class="aspect-square bg-zinc-800 rounded-md flex items-center justify-center overflow-hidden text-zinc-500 relative"
          >
            {#if item.images && item.images.length > 0}
              <img
                src={item.images[0].url}
                alt={item.name}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 19.5h10.5m-15-2.25H9m-3.75 2.25H9m0-15H5.25m12 0h-4.5m4.5 0a3 3 0 11-6 0 3 3 0 016 0z"
                /></svg
              >
            {/if}
          </div>
          <span class="text-sm font-medium text-zinc-200 truncate"
            >{item.name}</span
          >
        </div>
      {:else}
        <!-- Artist Icon -->
        <div
          class="w-10 h-10 bg-zinc-800 rounded-full flex-none flex items-center justify-center text-zinc-500 group-hover:text-zinc-300"
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
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
      {/if}

      <div class="flex-1 min-w-0">
        <h3
          class="text-sm font-medium text-zinc-200 truncate group-hover:text-green-400"
        >
          {item.name}
        </h3>
        <p class="text-xs text-zinc-500">
          {type === "playlist" ? "Playlist" : "Artist"}
        </p>
      </div>
      <div class="text-zinc-600 group-hover:text-zinc-400">
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
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </button>
  {/each}
</div>

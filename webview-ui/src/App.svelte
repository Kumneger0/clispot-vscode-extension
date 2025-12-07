<script module lang="ts">
  import type {
    Album,
    Artist,
    Playlist,
    PlaylistTrackObject,
    SearchResponse,
    TracksType,
    UserLibrary,
  } from "../../src/types/types.js";

  import type { WebviewApi } from "vscode-webview";

  /**
 * 
 * 

  
  if (typeof acquireVsCodeApi === "undefined") {
    (window as any).acquireVsCodeApi = () => ({
      postMessage: (message: any) => {
        console.log("Mock VS Code postMessage:", message);
        if (message.type === "getLibrary") {
          setTimeout(() => {
            window.postMessage(
              {
                type: "libraryData",
                data: {
                  playlist: [
                    { id: "1", name: "Mock Playlist 1", type: "playlist" },
                  ],
                  artist: [{ id: "2", name: "Mock Artist 1", type: "artist" }],
                },
              },
              "*"
            );
          }, 100);
        }
        if (message.type === "getTracks") {
          setTimeout(() => {
            window.postMessage(
              {
                type: "tracksData",
                data: [
                  {
                    track: {
                      id: "t1",
                      name: "Mock Track 1",
                      artists: [{ name: "Artist A" }],
                    },
                  },
                  {
                    track: {
                      id: "t2",
                      name: "Mock Track 2",
                      artists: [{ name: "Artist B" }],
                    },
                  },
                ],
              },
              "*"
            );
          }, 100);
        }
        if (message.type === "search") {
          setTimeout(() => {
            const mockSearchResponse: SearchResponse = {
              tracks: {
                href: "",
                limit: 20,
                next: "",
                offset: 0,
                previous: "",
                total: 2,
                items: [
                  {
                    id: "st1",
                    name: "Search Track 1",
                    artists: [
                      {
                        name: "Search Artist A",
                        id: "sa1",
                        type: "artist",
                        uri: "",
                        external_urls: { spotify: "" },
                        href: "",
                        followers: { total: 0, href: null },
                        genres: [],
                        images: [],
                        popularity: 0,
                      },
                    ],
                    album: { name: "Search Album 1", images: [] },
                    duration_ms: 0,
                  },
                  {
                    id: "st2",
                    name: "Search Track 2",
                    artists: [
                      {
                        name: "Search Artist B",
                        id: "sa2",
                        type: "artist",
                        uri: "",
                        external_urls: { spotify: "" },
                        href: "",
                        followers: { total: 0, href: null },
                        genres: [],
                        images: [],
                        popularity: 0,
                      },
                    ],
                    album: { name: "Search Album 2", images: [] },
                    duration_ms: 0,
                  },
                ],
              },
              artists: {
                href: "",
                limit: 20,
                next: "",
                offset: 0,
                previous: "",
                total: 2,
                items: [
                  {
                    id: "sa1",
                    name: "Search Artist A",
                    type: "artist",
                    uri: "",
                    external_urls: { spotify: "" },
                    href: "",
                    followers: { total: 0, href: null },
                    genres: ["Pop"],
                    images: [],
                    popularity: 50,
                  },
                  {
                    id: "sa2",
                    name: "Search Artist B",
                    type: "artist",
                    uri: "",
                    external_urls: { spotify: "" },
                    href: "",
                    followers: { total: 0, href: null },
                    genres: ["Rock"],
                    images: [],
                    popularity: 60,
                  },
                ],
              },
              albums: {
                href: "",
                limit: 20,
                next: "",
                offset: 0,
                previous: "",
                total: 2,
                items: [
                  { name: "Search Album 1", images: [] },
                  { name: "Search Album 2", images: [] },
                ],
              },
              playlists: {
                href: "",
                limit: 20,
                next: "",
                offset: 0,
                previous: "",
                total: 2,
                items: [
                  {
                    id: "sp1",
                    name: "Search Playlist 1",
                    type: "playlist",
                    uri: "",
                    external_urls: { spotify: "" },
                    href: "",
                    images: [],
                    owner: {
                      display_name: "User 1",
                      external_urls: { spotify: "" },
                      href: "",
                      id: "u1",
                      type: "user",
                      uri: "",
                    },
                    public: true,
                    collaborative: false,
                    snapshot_id: "",
                    tracks: { href: "", total: 10 },
                    description: "",
                  },
                  {
                    id: "sp2",
                    name: "Search Playlist 2",
                    type: "playlist",
                    uri: "",
                    external_urls: { spotify: "" },
                    href: "",
                    images: [],
                    owner: {
                      display_name: "User 2",
                      external_urls: { spotify: "" },
                      href: "",
                      id: "u2",
                      type: "user",
                      uri: "",
                    },
                    public: true,
                    collaborative: false,
                    snapshot_id: "",
                    tracks: { href: "", total: 5 },
                    description: "",
                  },
                ],
              },
              shows: {
                href: "",
                limit: 0,
                next: "",
                offset: 0,
                previous: "",
                total: 0,
                items: [],
              },
              episodes: {
                href: "",
                limit: 0,
                next: "",
                offset: 0,
                previous: "",
                total: 0,
                items: [],
              },
              audiobooks: {
                href: "",
                limit: 0,
                next: "",
                offset: 0,
                previous: "",
                total: 0,
                items: [],
              },
            };
            window.postMessage(
              { type: "searchResult", data: mockSearchResponse },
              "*"
            );
          }, 300);
        }
      },
      getState: () => {
        return (window as any).vsCodeState;
      },
      setState: (state: any) => {
        (window as any).vsCodeState = state;
        console.log("Mock VS Code setState:", state);
      },
    });
  }


   * 
 * 
*/

  declare const acquireVsCodeApi: () => WebviewApi<{}>;
  const vscode = acquireVsCodeApi();
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import Navigation from "./components/Navigation.svelte";
  import TrackList from "./components/TrackList.svelte";
  import LibraryList from "./components/LibraryList.svelte";
  import Search from "./components/Search.svelte";

  let activeTab = $state("saved_tracks");
  let library = $state<UserLibrary>({ playlist: [], artist: [] });
  let tracks = $state<PlaylistTrackObject[]>([]);
  let loading = $state(false);

  let searchQuery = $state("");
  let searchResults = $state<SearchResponse | null>(null);
  let isSearching = $state(false);
  let searchCategory = $state<"tracks" | "artists" | "albums" | "playlists">(
    "tracks",
  );

  onMount(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      console.log(message);
      switch (message.type) {
        case "libraryData":
          library = message.data;
          break;
        case "tracksData":
          tracks = message.data;
          loading = false;
          break;
        case "searchResult":
          console.log("search result data", message.data);
          searchResults = message.data;
          isSearching = false;
          break;
      }
    });

    vscode.postMessage({ type: "getLibrary" });
    loadTracks("saved_tracks", "saved_tracks");
    console.log(library);
  });

  function loadTracks(id: string, type: TracksType) {
    loading = true;
    tracks = [];
    vscode.postMessage({ type: "getTracks", id, context: type });
  }

  function playTrack(
    trackId: string,
    contextUri: string,
    index: number,
    tracksList: PlaylistTrackObject[],
  ) {
    const data = {
      type: "playTrack",
      trackId,
      contextUri,
      index,
      tracks: JSON.parse(JSON.stringify(tracksList)),
    };

    vscode.postMessage(data);
  }

  function handleSearch() {
    console.log("is about to search", searchQuery);
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
      {#if loading}
        <div class="flex items-center justify-center p-8">
          <p class="text-zinc-500 animate-pulse text-xs">Loading...</p>
        </div>
      {:else if tracks.length === 0}
        <div class="flex flex-col items-center justify-center p-8 text-center">
          <p class="text-zinc-400 text-sm mb-1">No tracks</p>
        </div>
      {:else}
        <TrackList {tracks} {playTrack} context="saved_tracks" />
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
        items={library.artist || []}
        type="album"
        onSelect={(item) => {
          activeTab = "artist_view";
          loadTracks((item as Album).id, "album");
        }}
      />
    {/if}

    {#if activeTab === "playlist_view" || activeTab === "artist_view"}
      <div
        class="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xs border-b border-zinc-800/50"
      >
        <button
          class="w-full flex items-center space-x-2 text-zinc-400 hover:text-white hover:bg-zinc-900 py-3 px-3 transition-all text-sm font-medium"
          onclick={() =>
            (activeTab =
              activeTab === "playlist_view" ? "playlists" : "artists")}
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
      </div>

      {#if loading}
        <div class="flex items-center justify-center p-8">
          <p class="text-zinc-500 animate-pulse text-xs">Loading...</p>
        </div>
      {:else}
        <TrackList {tracks} {playTrack} context="todo_context" />
      {/if}
    {/if}

    {#if activeTab === "search"}
      <Search
        bind:searchQuery
        {searchResults}
        {isSearching}
        {handleSearch}
        bind:searchCategory
        {playTrack}
        {loadTracks}
      />
    {/if}
  </div>
</main>

import { 
  UserLibrary, 
  TracksResponse, 
  PlayRequestBody, 
  SearchResponse, 
  Playlist, 
  Artist, 
  Album, 
  Track, 
  PlaylistTrackObject 
} from '../types/types.js';


export function createMockFetch() {
  const originalFetch = global.fetch;
  
  return {
    mock: (handler: (url: string, options?: RequestInit) => Promise<Response>) => {
      global.fetch = handler as any;
    },
    restore: () => {
      global.fetch = originalFetch;
    }
  };
}


export function createMockResponse<T>(data: T, status: number = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  } as Response;
}


export function createMockErrorResponse(error: string, status: number = 500): Response {
  return {
    ok: false,
    status,
    json: async () => ({ error }),
    text: async () => JSON.stringify({ error }),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  } as Response;
}


export function createMockArtist(overrides?: Partial<Artist>): Artist {
  return {
    external_urls: { spotify: 'https://open.spotify.com/artist/test' },
    href: 'https://api.spotify.com/v1/artists/test',
    id: 'artist-123',
    name: 'Test Artist',
    type: 'artist',
    uri: 'spotify:artist:test',
    followers: { href: null, total: 10000 },
    genres: ['rock', 'indie'],
    images: [
      { url: 'https://i.scdn.co/image/test', height: 640, width: 640 }
    ],
    popularity: 75,
    ...overrides
  };
}

export function createMockAlbum(overrides?: Partial<Album>): Album {
  return {
    name: 'Test Album',
    id: 'album-123',
    images: [
      { url: 'https://i.scdn.co/image/album-test', height: 640, width: 640 }
    ],
    ...overrides
  };
}

export function createMockTrack(overrides?: Partial<Track>): Track {
  return {
    id: 'track-123',
    name: 'Test Track',
    artists: [createMockArtist()],
    album: createMockAlbum(),
    duration_ms: 240000, // 4 minutes
    ...overrides
  };
}

export function createMockPlaylistTrackObject(overrides?: Partial<PlaylistTrackObject>): PlaylistTrackObject {
  return {
    track: createMockTrack(),
    isItFromQueue: false,
    ...overrides
  };
}

export function createMockPlaylist(overrides?: Partial<Playlist>): Playlist {
  return {
    collaborative: false,
    description: 'Test Playlist Description',
    external_urls: { spotify: 'https://open.spotify.com/playlist/test' },
    href: 'https://api.spotify.com/v1/playlists/test',
    id: 'playlist-123',
    images: [
      { url: 'https://i.scdn.co/image/playlist-test', height: 640, width: 640 }
    ],
    name: 'Test Playlist',
    owner: {
      external_urls: { spotify: 'https://open.spotify.com/user/test' },
      href: 'https://api.spotify.com/v1/users/test',
      id: 'user-123',
      type: 'user',
      uri: 'spotify:user:test',
      display_name: 'Test User'
    },
    public: true,
    snapshot_id: 'snapshot-123',
    tracks: {
      href: 'https://api.spotify.com/v1/playlists/test/tracks',
      total: 10
    },
    type: 'playlist',
    uri: 'spotify:playlist:test',
    ...overrides
  };
}


export function createMockLibraryResponse(): UserLibrary {
  return {
    playlist: [
      createMockPlaylist({ id: 'playlist-1', name: 'My Playlist 1' }),
      createMockPlaylist({ id: 'playlist-2', name: 'My Playlist 2' })
    ],
    artist: [
      createMockArtist({ id: 'artist-1', name: 'Artist 1' }),
      createMockArtist({ id: 'artist-2', name: 'Artist 2' })
    ],
    album: [
      createMockAlbum({ id: 'album-1', name: 'Album 1' }),
      createMockAlbum({ id: 'album-2', name: 'Album 2' })
    ]
  };
}

export function createMockTracksResponse(count: number = 5): TracksResponse {
  const tracks: PlaylistTrackObject[] = [];
  for (let i = 0; i < count; i++) {
    tracks.push(createMockPlaylistTrackObject({
      track: createMockTrack({
        id: `track-${i}`,
        name: `Track ${i + 1}`
      })
    }));
  }
  return { tracks };
}

export function createMockSearchResponse(): SearchResponse {
  return {
    tracks: {
      href: 'https://api.spotify.com/v1/search?q=test',
      limit: 20,
      next: '',
      offset: 0,
      previous: '',
      total: 1,
      items: [createMockTrack({ name: 'Search Result Track' })]
    },
    artists: {
      href: 'https://api.spotify.com/v1/search?q=test',
      limit: 20,
      next: '',
      offset: 0,
      previous: '',
      total: 1,
      items: [createMockArtist({ name: 'Search Result Artist' })]
    },
    albums: {
      href: 'https://api.spotify.com/v1/search?q=test',
      limit: 20,
      next: '',
      offset: 0,
      previous: '',
      total: 1,
      items: [createMockAlbum({ name: 'Search Result Album' })]
    },
    playlists: {
      href: 'https://api.spotify.com/v1/search?q=test',
      limit: 20,
      next: '',
      offset: 0,
      previous: '',
      total: 1,
      items: [createMockPlaylist({ name: 'Search Result Playlist' })]
    },
    shows: {
      href: 'https://api.spotify.com/v1/search?q=test',
      limit: 20,
      next: '',
      offset: 0,
      previous: '',
      total: 0,
      items: []
    },
    episodes: {
      href: 'https://api.spotify.com/v1/search?q=test',
      limit: 20,
      next: '',
      offset: 0,
      previous: '',
      total: 0,
      items: []
    },
    audiobooks: {
      href: 'https://api.spotify.com/v1/search?q=test',
      limit: 20,
      next: '',
      offset: 0,
      previous: '',
      total: 0,
      items: []
    }
  };
}

export function createMockPlayResponse(body: PlayRequestBody) {
  return {
    status: 'ok',
    message: 'track is now playing',
    track: {
      id: body.trackID,
      name: body.name,
      album: body.album,
      artists: body.artists
    }
  };
}


export function createMockToggleResponse(action: 'paused' | 'play') {
  return {
    status: 'ok',
    action
  };
}

export function createMockApiHandler() {
  return async (url: string, options?: RequestInit): Promise<Response> => {
    const BASE_URL = 'http://localhost:8282';
    const fullUrl = url.startsWith(BASE_URL) ? url : `${BASE_URL}${url}`;
    const parsedUrl = new URL(fullUrl);
    const pathname = parsedUrl.pathname;

    if (pathname === '/library' && (!options || options.method === 'GET')) {
      return createMockResponse(createMockLibraryResponse());
    }

    if (pathname === '/tracks' && (!options || options.method === 'GET')) {
      const id = parsedUrl.searchParams.get('id');
      const type = parsedUrl.searchParams.get('type');
      
      if (!id || !type) {
        return createMockErrorResponse('missing required query param', 400);
      }
      
      return createMockResponse(createMockTracksResponse());
    }

    if (pathname === '/search' && (!options || options.method === 'GET')) {
      const query = parsedUrl.searchParams.get('q');
      
      if (!query) {
        return createMockErrorResponse('please provide a search query', 400);
      }
      
      return createMockResponse(createMockSearchResponse());
    }

    if (pathname === '/player' && (!options || options.method === 'GET')) {
      return createMockResponse(createMockToggleResponse('paused'));
    }

    if (pathname === '/player/play' && options?.method === 'POST') {
      if (!options.body) {
        return createMockErrorResponse('request body required', 400);
      }
      
      const body = JSON.parse(options.body as string) as PlayRequestBody;
      
      if (!body.trackID) {
        return createMockErrorResponse('trackID is required', 400);
      }
      if (!body.name) {
        return createMockErrorResponse('trackName is required', 400);
      }
      if (!body.artists || body.artists.length === 0) {
        return createMockErrorResponse('artists is required', 400);
      }
      
      return createMockResponse(createMockPlayResponse(body));
    }

    if (pathname === '/' && (!options || options.method === 'GET')) {
      return {
        ok: true,
        status: 200,
        text: async () => 'server is up',
        json: async () => ({ message: 'server is up' }),
        headers: new Headers(),
      } as Response;
    }

    return createMockErrorResponse('not found', 404);
  };
}

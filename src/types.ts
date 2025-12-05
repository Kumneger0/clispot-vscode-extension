export type TracksType = "playlist" | "followed_artist" | "saved_tracks";

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface MusicQueue {
  Items: PlaylistTrackObject[];
  currentIndex: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Owner {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

export interface PlaylistTracksRef {
  href: string;
  total: number;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistTracksRef;
  type: string;
  uri: string;
}

export interface Followers {
  href: string | null;
  total: number;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  followers: Followers;
  genres: string[];
  images: Image[];
  popularity: number;
}

export interface Album {
  name: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number
}

export interface PlaylistTrackObject {
  track: Track;
}

export interface UserLibrary {
  playlist: Playlist[];
  artist: Artist[];
}

export interface TracksResponse {
  tracks: PlaylistTrackObject[];
}

export interface PlayRequestBody {
  trackID: string;
  name: string;
  artists: string[];
  album: string;
}

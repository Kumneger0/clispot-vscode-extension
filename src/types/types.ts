export type TracksType = "playlist" | "followed_artist" | "saved_tracks" | "album_tracks";

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


export interface Paging<T> {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items?: T[];
}

export interface PlaylistOwner {
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
  images: Image[]; 
  id:string
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
}

export interface PlaylistTrackObject {
  track: Track;
}

export interface UserLibrary {
  playlist: Playlist[];
  artist: Artist[];
  album: Album[];
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


export interface Restrictions {
  reason: string;
}

export interface ResumePoint {
  fully_played: boolean;
  resume_position_ms: number;
}

export interface Author {
  name: string;
}

export interface Narrator {
  name: string;
}

export interface Show {
  available_markets: string[];
  copyrights: any[]; // Simplified
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: string;
  uri: string;
  total_episodes: number;
}

export interface Episode {
  audio_preview_url: string;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  language: string;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: string;
  resume_point: ResumePoint;
  type: string;
  uri: string;
  restrictions: Restrictions;
}

export interface Audiobook {
  authors: Author[];
  available_markets: string[];
  copyrights: any[]; 
  description: string;
  html_description: string;
  edition: string;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  languages: string[];
  media_type: string;
  name: string;
  narrators: Narrator[];
  publisher: string;
  type: string;
  uri: string;
  total_chapters: number;
}

export interface SearchResponse {
  tracks: Paging<Track>;
  artists: Paging<Artist>;
  albums: Paging<Album>;
  playlists: Paging<Playlist>;
  shows: Paging<Show>;
  episodes: Paging<Episode>;
  audiobooks: Paging<Audiobook>;
}

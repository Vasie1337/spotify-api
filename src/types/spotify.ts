export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  genres: string[];
  followers: {
    total: number;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    name: string;
    images: SpotifyImage[];
  };
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
}

export interface SpotifyProfile {
  id: string;
  display_name: string;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: SpotifyImage[];
  tracks: {
    total: number;
  };
}

export interface RecentlyPlayedTrack {
  track: SpotifyTrack;
  played_at: string;
}

export interface SpotifyResponse<T> {
  items: T[];
  total: number;
}

export interface SpotifyPlaybackState {
  is_playing: boolean;
  item: SpotifyTrack;
  progress_ms: number;
  device: {
    id: string;
    name: string;
    type: string;
    volume_percent: number;
  };
  shuffle_state: boolean;
  repeat_state: 'off' | 'track' | 'context';
}
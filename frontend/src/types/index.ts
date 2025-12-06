// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: UserResponse;
  tokens: TokenPair;
}

export interface RegisterResponse {
  user: UserResponse;
  tokens: TokenPair;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// User Types
export interface UserResponse {
  id: number;
  name: string;
  avatar: string | null;
}

// Track Types
export interface TrackResponse {
  id: number;
  title: string;
  duration: number;
  createAt: string;
  audioUrl?: string;
  coverUrl?: string;
  artist: ArtistResponse | null;
  source: SourceResponse | null;
  album: AlbumResponse | null;
}

export interface TrackCreateRequest {
  title: string;
  artistId: number | null;
  sourceId: number | null;
  albumId: number | null;
  tagIds: number[];
}

// Artist Types
export interface ArtistResponse {
  id: number;
  name: string;
}

export interface ArtistCreateRequest {
  name: string;
}

export interface ArtistUpdateRequest {
  name: string;
}

// Album Types
export interface AlbumResponse {
  id: number;
  title: string;
  artist: ArtistResponse | null;
}

export interface AlbumCreateRequest {
  title: string;
  artistId: number | null;
}

export interface AlbumUpdateRequest {
  title: string;
  artistId: number | null;
}

// Source Types
export interface SourceResponse {
  id: number;
  name: string;
}

export interface SourceCreateRequest {
  name: string;
}

export interface SourceUpdateRequest {
  name: string;
}

// Tag Types
export interface TagResponse {
  id: number;
  name: string;
}

export interface TagCreateRequest {
  name: string;
}

export interface TagUpdateRequest {
  name: string;
}

// Page Types
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}


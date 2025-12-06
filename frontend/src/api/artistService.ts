import apiClient from './apiClient';
import { ArtistResponse, ArtistCreateRequest, ArtistUpdateRequest, PageResponse, AlbumResponse, TrackResponse } from '../types';

export const artistService = {
  async getAllArtists(page: number = 0, size: number = 10): Promise<PageResponse<ArtistResponse>> {
    const response = await apiClient.get<PageResponse<ArtistResponse>>('/artists', {
      params: { page, size },
    });
    return response.data;
  },

  async getArtistById(id: number): Promise<ArtistResponse> {
    const response = await apiClient.get<ArtistResponse>(`/artists/${id}`);
    return response.data;
  },

  async searchArtists(query: string): Promise<ArtistResponse[]> {
    const response = await apiClient.get<ArtistResponse[]>('/artists/search', {
      params: { q: query },
    });
    return response.data;
  },

  async createArtist(data: ArtistCreateRequest): Promise<ArtistResponse> {
    const response = await apiClient.post<ArtistResponse>('/artists', data);
    return response.data;
  },

  async updateArtist(id: number, data: ArtistUpdateRequest): Promise<ArtistResponse> {
    const response = await apiClient.put<ArtistResponse>(`/artists/${id}`, data);
    return response.data;
  },

  async deleteArtist(id: number): Promise<void> {
    await apiClient.delete(`/artists/${id}`);
  },

  async getArtistAlbums(id: number, page: number = 0, size: number = 10): Promise<PageResponse<AlbumResponse>> {
    const response = await apiClient.get<PageResponse<AlbumResponse>>(`/artists/${id}/albums`, {
      params: { page, size },
    });
    return response.data;
  },

  async getArtistTracks(id: number, page: number = 0, size: number = 10): Promise<PageResponse<TrackResponse>> {
    const response = await apiClient.get<PageResponse<TrackResponse>>(`/artists/${id}/tracks`, {
      params: { page, size },
    });
    return response.data;
  },

  async downloadArtistTracks(id: number): Promise<Blob> {
    const response = await apiClient.get(`/artists/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};


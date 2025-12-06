import apiClient from './apiClient';
import { AlbumResponse, AlbumCreateRequest, AlbumUpdateRequest, PageResponse, TrackResponse } from '../types';

export const albumService = {
  async getAllAlbums(page: number = 0, size: number = 10): Promise<PageResponse<AlbumResponse>> {
    const response = await apiClient.get<PageResponse<AlbumResponse>>('/albums', {
      params: { page, size },
    });
    return response.data;
  },

  async getAlbumById(id: number): Promise<AlbumResponse> {
    const response = await apiClient.get<AlbumResponse>(`/albums/${id}`);
    return response.data;
  },

  async searchAlbums(query: string): Promise<AlbumResponse[]> {
    const response = await apiClient.get<AlbumResponse[]>('/albums/search', {
      params: { q: query },
    });
    return response.data;
  },

  async createAlbum(data: AlbumCreateRequest): Promise<AlbumResponse> {
    const response = await apiClient.post<AlbumResponse>('/albums', data);
    return response.data;
  },

  async updateAlbum(id: number, data: AlbumUpdateRequest): Promise<AlbumResponse> {
    const response = await apiClient.put<AlbumResponse>(`/albums/${id}`, data);
    return response.data;
  },

  async deleteAlbum(id: number): Promise<void> {
    await apiClient.delete(`/albums/${id}`);
  },

  async getAlbumTracks(id: number, page: number = 0, size: number = 10): Promise<PageResponse<TrackResponse>> {
    const response = await apiClient.get<PageResponse<TrackResponse>>(`/albums/${id}/tracks`, {
      params: { page, size },
    });
    return response.data;
  },

  async downloadAlbumTracks(id: number): Promise<Blob> {
    const response = await apiClient.get(`/albums/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};


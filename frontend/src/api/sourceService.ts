import apiClient from './apiClient';
import { SourceResponse, SourceCreateRequest, SourceUpdateRequest, PageResponse, TrackResponse } from '../types';

export const sourceService = {
  async getAllSources(page: number = 0, size: number = 10): Promise<PageResponse<SourceResponse>> {
    const response = await apiClient.get<PageResponse<SourceResponse>>('/sources', {
      params: { page, size },
    });
    return response.data;
  },

  async getSourceById(id: number): Promise<SourceResponse> {
    const response = await apiClient.get<SourceResponse>(`/sources/${id}`);
    return response.data;
  },

  async searchSources(query: string): Promise<SourceResponse[]> {
    const response = await apiClient.get<SourceResponse[]>('/sources/search', {
      params: { q: query },
    });
    return response.data;
  },

  async createSource(data: SourceCreateRequest): Promise<SourceResponse> {
    const response = await apiClient.post<SourceResponse>('/sources', data);
    return response.data;
  },

  async updateSource(id: number, data: SourceUpdateRequest): Promise<SourceResponse> {
    const response = await apiClient.put<SourceResponse>(`/sources/${id}`, data);
    return response.data;
  },

  async deleteSource(id: number): Promise<void> {
    await apiClient.delete(`/sources/${id}`);
  },

  async getSourceTracks(id: number, page: number = 0, size: number = 10): Promise<PageResponse<TrackResponse>> {
    const response = await apiClient.get<PageResponse<TrackResponse>>(`/sources/${id}/tracks`, {
      params: { page, size },
    });
    return response.data;
  },

  async downloadSourceTracks(id: number): Promise<Blob> {
    const response = await apiClient.get(`/sources/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};


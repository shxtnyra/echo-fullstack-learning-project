import apiClient from './apiClient';
import { TrackResponse, TrackCreateRequest, PageResponse } from '../types';

export const trackService = {
  async getAllTracks(page: number = 0, size: number = 10): Promise<PageResponse<TrackResponse>> {
    const response = await apiClient.get<PageResponse<TrackResponse>>('/tracks', {
      params: { page, size },
    });
    return response.data;
  },

  async createTrack(
    request: TrackCreateRequest,
    audioFile: File,
    coverFile?: File
  ): Promise<TrackResponse> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    formData.append('audioFile', audioFile);
    if (coverFile) {
      formData.append('coverFile', coverFile);
    }

    const response = await apiClient.post<TrackResponse>('/tracks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async downloadAllTracks(): Promise<Blob> {
    const response = await apiClient.get('/tracks/all-download', {
      responseType: 'blob',
    });
    return response.data;
  },
};


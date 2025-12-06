import apiClient from './apiClient';
import { TagResponse, TagCreateRequest, TagUpdateRequest } from '../types';

export const tagService = {
  async getTagById(id: number): Promise<TagResponse> {
    const response = await apiClient.get<TagResponse>(`/tags/${id}`);
    return response.data;
  },

  async searchTags(query: string): Promise<TagResponse[]> {
    const response = await apiClient.get<TagResponse[]>('/tags/search', {
      params: { q: query },
    });
    return response.data;
  },

  async getRandomTags(size: number = 10): Promise<TagResponse[]> {
    const response = await apiClient.get<TagResponse[]>('/tags/random', {
      params: { size },
    });
    return response.data;
  },

  async getFirstTags(size: number = 10): Promise<TagResponse[]> {
    const response = await apiClient.get<TagResponse[]>('/tags/first', {
      params: { size },
    });
    return response.data;
  },

  async createTag(data: TagCreateRequest): Promise<TagResponse> {
    const response = await apiClient.post<TagResponse>('/tags', data);
    return response.data;
  },

  async updateTag(id: number, data: TagUpdateRequest): Promise<TagResponse> {
    const response = await apiClient.put<TagResponse>(`/tags/${id}`, data);
    return response.data;
  },

  async deleteTag(id: number): Promise<void> {
    await apiClient.delete(`/tags/${id}`);
  },
};


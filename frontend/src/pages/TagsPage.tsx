import React, { useState, useEffect } from 'react';
import { TagResponse } from '../types';
import { tagService } from '../api/tagService';
import { CreateTagModal } from '../components/CreateTagModal';
import { useAuth } from '../context/AuthContext';

export const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (searchQuery) {
      searchTags();
    } else {
      loadRandomTags();
    }
  }, [searchQuery]);

  const loadRandomTags = async () => {
    setLoading(true);
    try {
      const results = await tagService.getRandomTags(30);
      setTags(results);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchTags = async () => {
    setLoading(true);
    try {
      const results = await tagService.searchTags(searchQuery);
      setTags(results);
    } catch (error) {
      console.error('Failed to search tags:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-semibold mb-1">
            TAGS OVERVIEW ({tags.length})
          </h2>
          <p className="text-[#666] text-sm">TAGS IN LIBRARY</p>
        </div>
        <div className="flex items-center space-x-2">
          {isAuthenticated && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] text-sm transition-colors"
            >
              + NEW TAG
            </button>
          )}
          <button
            onClick={loadRandomTags}
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-sm border border-[#1a1a1a] transition-colors"
          >
            RANDOM TAGS
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH TAGS..."
          className="w-full px-4 py-3 bg-[#111111] border border-[#1a1a1a] text-white placeholder-[#666] focus:outline-none focus:border-[#00ff88] transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#666] text-xl">NO TAGS FOUND</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] hover:border-[#00ff88] transition-colors cursor-pointer"
            >
              <span className="text-[#00ff88] font-medium text-sm">#{tag.name}</span>
            </div>
          ))}
        </div>
      )}

      <CreateTagModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          if (searchQuery) {
            searchTags();
          } else {
            loadRandomTags();
          }
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

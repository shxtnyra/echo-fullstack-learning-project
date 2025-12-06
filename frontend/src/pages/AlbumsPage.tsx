import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlbumResponse } from '../types';
import { albumService } from '../api/albumService';
import { CreateAlbumModal } from '../components/CreateAlbumModal';
import { useAuth } from '../context/AuthContext';

export const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<AlbumResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (searchQuery) {
      searchAlbums();
    } else {
      loadAlbums();
    }
  }, [currentPage, searchQuery]);

  const loadAlbums = async () => {
    setLoading(true);
    try {
      const response = await albumService.getAllAlbums(currentPage, 20);
      setAlbums(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchAlbums = async () => {
    setLoading(true);
    try {
      const results = await albumService.searchAlbums(searchQuery);
      setAlbums(results);
      setTotalPages(0);
    } catch (error) {
      console.error('Failed to search albums:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-semibold mb-1">
            ALBUMS OVERVIEW ({albums.length})
          </h2>
          <p className="text-[#666] text-sm">ALBUMS IN LIBRARY</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] text-sm transition-colors"
          >
            + NEW ALBUM
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0);
          }}
          placeholder="SEARCH ALBUMS..."
          className="w-full px-4 py-3 bg-[#111111] border border-[#1a1a1a] text-white placeholder-[#666] focus:outline-none focus:border-[#00ff88] transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#666] text-xl">NO ALBUMS FOUND</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.map((album) => (
              <Link
                key={album.id}
                to={`/albums/${album.id}`}
                className="bg-[#111111] border border-[#1a1a1a] p-4 hover:border-[#00ff88] transition-colors"
              >
                <div className="w-full aspect-square mb-3 bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] text-4xl">
                  💿
                </div>
                <h3 className="text-white font-semibold text-sm truncate mb-1">{album.title}</h3>
                {album.artist && (
                  <p className="text-[#666] text-xs truncate">{album.artist.name}</p>
                )}
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {!searchQuery && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-sm border border-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                PREV
              </button>
              <span className="text-[#666] text-sm px-4">
                PAGE {currentPage + 1} OF {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-sm border border-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                NEXT
              </button>
            </div>
          )}
        </>
      )}

      <CreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          loadAlbums();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

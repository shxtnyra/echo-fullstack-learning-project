import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArtistResponse } from '../types';
import { artistService } from '../api/artistService';
import { CreateArtistModal } from '../components/CreateArtistModal';
import { useAuth } from '../context/AuthContext';

export const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<ArtistResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (searchQuery) {
      searchArtists();
    } else {
      loadArtists();
    }
  }, [currentPage, searchQuery]);

  const loadArtists = async () => {
    setLoading(true);
    try {
      const response = await artistService.getAllArtists(currentPage, 20);
      setArtists(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchArtists = async () => {
    setLoading(true);
    try {
      const results = await artistService.searchArtists(searchQuery);
      setArtists(results);
      setTotalPages(0);
    } catch (error) {
      console.error('Failed to search artists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-semibold mb-1">
            ARTISTS OVERVIEW ({artists.length})
          </h2>
          <p className="text-[#666] text-sm">ARTISTS IN LIBRARY</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] text-sm transition-colors"
          >
            + NEW ARTIST
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
          placeholder="SEARCH ARTISTS..."
          className="w-full px-4 py-3 bg-[#111111] border border-[#1a1a1a] text-white placeholder-[#666] focus:outline-none focus:border-[#00ff88] transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
        </div>
      ) : artists.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#666] text-xl">NO ARTISTS FOUND</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artists/${artist.id}`}
                className="bg-[#111111] border border-[#1a1a1a] p-4 hover:border-[#00ff88] transition-colors text-center"
              >
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] text-3xl">
                  🎤
                </div>
                <h3 className="text-white font-semibold text-sm truncate">{artist.name}</h3>
                <p className="text-[#666] text-xs mt-1">ID: {artist.id}</p>
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

      <CreateArtistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          loadArtists();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

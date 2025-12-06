import React, { useState, useEffect } from 'react';
import { AlbumCreateRequest, ArtistResponse } from '../types';
import { albumService } from '../api/albumService';
import { artistService } from '../api/artistService';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [artists, setArtists] = useState<ArtistResponse[]>([]);
  const [searchArtist, setSearchArtist] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadArtists();
    }
  }, [isOpen]);

  const loadArtists = async () => {
    try {
      const response = await artistService.getAllArtists(0, 50);
      setArtists(response.content);
    } catch (error) {
      console.error('Failed to load artists:', error);
    }
  };

  const handleSearchArtist = async (query: string) => {
    setSearchArtist(query);
    if (query.length > 0) {
      try {
        const results = await artistService.searchArtists(query);
        setArtists(results);
      } catch (error) {
        console.error('Failed to search artists:', error);
      }
    } else {
      loadArtists();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const request: AlbumCreateRequest = { title, artistId };
      await albumService.createAlbum(request);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'FAILED TO CREATE ALBUM');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setArtistId(null);
    setError('');
    setSearchArtist('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md">
        <div className="p-6 border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">CREATE ALBUM</h2>
            <button
              onClick={handleClose}
              className="text-[#999] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-[#1a1a1a] border border-red-500/50 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              TITLE *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              ARTIST
            </label>
            <input
              type="text"
              value={searchArtist}
              onChange={(e) => handleSearchArtist(e.target.value)}
              placeholder="SEARCH ARTIST..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white placeholder-[#666] focus:outline-none focus:border-[#00ff88] transition-colors mb-2"
            />
            <select
              value={artistId || ''}
              onChange={(e) => setArtistId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
            >
              <option value="">SELECT ARTIST</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#1a1a1a]">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-sm border border-[#1a1a1a] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CREATING...' : 'CREATE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


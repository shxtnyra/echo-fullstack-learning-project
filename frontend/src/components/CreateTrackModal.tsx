import React, { useState, useEffect } from 'react';
import { TrackCreateRequest, ArtistResponse, AlbumResponse, SourceResponse, TagResponse } from '../types';
import { artistService } from '../api/artistService';
import { albumService } from '../api/albumService';
import { sourceService } from '../api/sourceService';
import { tagService } from '../api/tagService';
import { trackService } from '../api/trackService';

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTrackModal: React.FC<CreateTrackModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [sourceId, setSourceId] = useState<number | null>(null);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [artists, setArtists] = useState<ArtistResponse[]>([]);
  const [albums, setAlbums] = useState<AlbumResponse[]>([]);
  const [sources, setSources] = useState<SourceResponse[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [searchArtist, setSearchArtist] = useState('');
  const [searchAlbum, setSearchAlbum] = useState('');
  const [searchSource, setSearchSource] = useState('');
  const [searchTag, setSearchTag] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      const [artistsRes, albumsRes, sourcesRes, tagsRes] = await Promise.all([
        artistService.getAllArtists(0, 50),
        albumService.getAllAlbums(0, 50),
        sourceService.getAllSources(0, 50),
        tagService.getFirstTags(50),
      ]);
      setArtists(artistsRes.content);
      setAlbums(albumsRes.content);
      setSources(sourcesRes.content);
      setTags(tagsRes);
    } catch (error) {
      console.error('Failed to load data:', error);
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
      loadInitialData();
    }
  };

  const handleSearchAlbum = async (query: string) => {
    setSearchAlbum(query);
    if (query.length > 0) {
      try {
        const results = await albumService.searchAlbums(query);
        setAlbums(results);
      } catch (error) {
        console.error('Failed to search albums:', error);
      }
    } else {
      loadInitialData();
    }
  };

  const handleSearchSource = async (query: string) => {
    setSearchSource(query);
    if (query.length > 0) {
      try {
        const results = await sourceService.searchSources(query);
        setSources(results);
      } catch (error) {
        console.error('Failed to search sources:', error);
      }
    } else {
      loadInitialData();
    }
  };

  const handleSearchTag = async (query: string) => {
    setSearchTag(query);
    if (query.length > 0) {
      try {
        const results = await tagService.searchTags(query);
        setTags(results);
      } catch (error) {
        console.error('Failed to search tags:', error);
      }
    } else {
      loadInitialData();
    }
  };

  const toggleTag = (tagId: number) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      setError('AUDIO FILE IS REQUIRED');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const request: TrackCreateRequest = {
        title,
        artistId,
        albumId,
        sourceId,
        tagIds,
      };

      await trackService.createTrack(request, audioFile, coverFile || undefined);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'FAILED TO CREATE TRACK');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setAudioFile(null);
    setCoverFile(null);
    setArtistId(null);
    setAlbumId(null);
    setSourceId(null);
    setTagIds([]);
    setError('');
    setSearchArtist('');
    setSearchAlbum('');
    setSearchSource('');
    setSearchTag('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">CREATE TRACK</h2>
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
              AUDIO FILE *
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              COVER IMAGE (OPTIONAL)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
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

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              ALBUM
            </label>
            <input
              type="text"
              value={searchAlbum}
              onChange={(e) => handleSearchAlbum(e.target.value)}
              placeholder="SEARCH ALBUM..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white placeholder-[#666] focus:outline-none focus:border-[#00ff88] transition-colors mb-2"
            />
            <select
              value={albumId || ''}
              onChange={(e) => setAlbumId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
            >
              <option value="">SELECT ALBUM</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              SOURCE
            </label>
            <input
              type="text"
              value={searchSource}
              onChange={(e) => handleSearchSource(e.target.value)}
              placeholder="SEARCH SOURCE..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white placeholder-[#666] focus:outline-none focus:border-[#00ff88] transition-colors mb-2"
            />
            <select
              value={sourceId || ''}
              onChange={(e) => setSourceId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
            >
              <option value="">SELECT SOURCE</option>
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              TAGS
            </label>
            <input
              type="text"
              value={searchTag}
              onChange={(e) => handleSearchTag(e.target.value)}
              placeholder="SEARCH TAGS..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white placeholder-[#666] focus:outline-none focus:border-[#00ff88] transition-colors mb-2"
            />
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#0a0a0a] border border-[#1a1a1a]">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 text-xs border transition-colors ${
                    tagIds.includes(tag.id)
                      ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                      : 'bg-[#1a1a1a] border-[#1a1a1a] text-[#999] hover:border-[#00ff88]'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
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


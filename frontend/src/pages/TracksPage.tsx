import React, { useState, useEffect } from 'react';
import { TrackResponse } from '../types';
import { trackService } from '../api/trackService';
import { AudioPlayer } from '../components/AudioPlayer';
import { CreateTrackModal } from '../components/CreateTrackModal';
import { MEDIA_URL } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export const TracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<TrackResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<TrackResponse | null>(null);
  const [playlist, setPlaylist] = useState<TrackResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadTracks();
  }, [currentPage]);

  const loadTracks = async () => {
    setLoading(true);
    try {
      const response = await trackService.getAllTracks(currentPage, 20);
      setTracks(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      if (currentPage === 0) {
        setPlaylist(response.content);
      }
    } catch (error) {
      console.error('Failed to load tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track: TrackResponse) => {
    setCurrentTrack(track);
    const index = playlist.findIndex((t) => t.id === track.id);
    if (index !== -1) {
      setCurrentIndex(index);
    } else {
      setPlaylist([track, ...playlist]);
      setCurrentIndex(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(playlist[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentTrack(playlist[prevIndex]);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'JUST NOW';
    if (diffMins < 60) return `${diffMins} MINS AGO`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} HRS AGO`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} DAYS AGO`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-semibold mb-1">
            TRACKS OVERVIEW ({totalElements})
          </h2>
          <p className="text-[#666] text-sm">ACTIVE TRACKS IN LIBRARY</p>
        </div>
        <div className="flex items-center space-x-2">
          {isAuthenticated && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] text-sm transition-colors"
            >
              + NEW TRACK
            </button>
          )}
          <button
            onClick={async () => {
              try {
                const blob = await trackService.downloadAllTracks();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'all-tracks.zip';
                a.click();
                window.URL.revokeObjectURL(url);
              } catch (error) {
                console.error('Failed to download tracks:', error);
              }
            }}
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-sm border border-[#1a1a1a] transition-colors"
          >
            + DOWNLOAD ALL
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm transition-colors ${
              viewMode === 'list'
                ? 'bg-[#1a1a1a] text-[#00ff88] border border-[#00ff88]'
                : 'bg-[#1a1a1a] text-[#999] border border-[#1a1a1a] hover:text-white'
            }`}
          >
            LIST
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 text-sm transition-colors ${
              viewMode === 'kanban'
                ? 'bg-[#1a1a1a] text-[#00ff88] border border-[#00ff88]'
                : 'bg-[#1a1a1a] text-[#999] border border-[#1a1a1a] hover:text-white'
            }`}
          >
            KANBAN
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'list' && (
        <div className="bg-[#111111] border border-[#1a1a1a]">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider">
                  TRACK ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider">
                  TITLE
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider">
                  ARTIST
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider">
                  ALBUM
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider">
                  DURATION
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider">
                  SOURCE
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider">
                  CREATED
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ff88]"></div>
                    </div>
                  </td>
                </tr>
              ) : tracks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[#666]">
                    NO TRACKS FOUND
                  </td>
                </tr>
              ) : (
                tracks.map((track) => (
                  <tr
                    key={track.id}
                    className="hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                    onClick={() => handlePlay(track)}
                  >
                    <td className="px-4 py-3 text-sm text-[#00ff88] font-mono">
                      T-{track.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{track.title}</td>
                    <td className="px-4 py-3 text-sm text-[#999]">
                      {track.artist?.name || 'UNKNOWN'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#999]">
                      {track.album?.title || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#999] font-mono">
                      {formatDuration(track.duration)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#999]">
                      {track.source?.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#666]">
                      {track.createAt ? formatDate(track.createAt) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(track);
                        }}
                        className="text-[#00ff88] hover:text-white transition-colors"
                      >
                        ▶
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ff88]"></div>
            </div>
          ) : tracks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#666]">
              NO TRACKS FOUND
            </div>
          ) : (
            tracks.map((track) => {
              const coverUrl = track.coverUrl ? `${MEDIA_URL}/${track.coverUrl}` : null;
              return (
                <div
                  key={track.id}
                  className="bg-[#111111] border border-[#1a1a1a] p-4 hover:border-[#00ff88] transition-colors cursor-pointer"
                  onClick={() => handlePlay(track)}
                >
                  <div className="flex items-start space-x-3">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={track.title}
                        className="w-16 h-16 object-cover border border-[#1a1a1a]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center">
                        <span className="text-[#666] text-2xl">🎵</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm mb-1 truncate">
                        {track.title}
                      </div>
                      <div className="text-[#666] text-xs mb-2">
                        {track.artist?.name || 'UNKNOWN'}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-[#666]">
                        <span>{formatDuration(track.duration)}</span>
                        {track.source && <span>• {track.source.name}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
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

      <AudioPlayer
        track={currentTrack}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <CreateTrackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          loadTracks();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

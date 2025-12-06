import React from 'react';
import { TrackResponse } from '../types';
import { MEDIA_URL } from '../api/apiClient';

interface TrackCardProps {
  track: TrackResponse;
  onPlay?: (track: TrackResponse) => void;
  onClick?: () => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay, onClick }) => {
  const coverUrl = track.coverUrl ? `${MEDIA_URL}/${track.coverUrl}` : null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-800/70 transition-all cursor-pointer group border border-purple-500/20"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* Cover */}
        <div className="relative flex-shrink-0">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={track.title}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl">
              🎵
            </div>
          )}
          {onPlay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(track);
              }}
              className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-2xl">▶️</span>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{track.title}</h3>
          <p className="text-gray-400 text-sm truncate">
            {track.artist?.name || 'Unknown Artist'}
            {track.album && ` • ${track.album.title}`}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-gray-500 text-xs">{formatDuration(track.duration)}</span>
            {track.source && (
              <span className="text-gray-500 text-xs">• {track.source.name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


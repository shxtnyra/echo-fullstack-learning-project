import React, { useState, useRef, useEffect } from 'react';
import { TrackResponse } from '../types';
import { MEDIA_URL } from '../api/apiClient';

interface AudioPlayerProps {
  track: TrackResponse | null;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onNext) onNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [track, onNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, track]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return null;
  }

  const audioUrl = track.audioUrl ? `${MEDIA_URL}/${track.audioUrl}` : null;
  const coverUrl = track.coverUrl ? `${MEDIA_URL}/${track.coverUrl}` : null;

  return (
    <div className="fixed bottom-0 bg-[#111111] border-t border-[#1a1a1a] p-4 z-50" style={{ left: '256px', right: 0 }}>
      <div className="flex items-center space-x-4">
        {/* Track Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={track.title}
              className="w-12 h-12 object-cover border border-[#1a1a1a]"
            />
          ) : (
            <div className="w-12 h-12 bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center">
              <span className="text-[#666]">🎵</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-semibold truncate">{track.title}</p>
            <p className="text-[#666] text-xs truncate">
              {track.artist?.name || 'UNKNOWN ARTIST'}
            </p>
          </div>
        </div>

        {/* Audio Element */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} volume={volume} />}

        {/* Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div className="flex items-center space-x-3">
            <button
              onClick={onPrevious}
              className="text-[#999] hover:text-[#00ff88] transition-colors text-sm"
              disabled={!onPrevious}
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#222] border border-[#1a1a1a] text-[#00ff88] flex items-center justify-center transition-colors"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={onNext}
              className="text-[#999] hover:text-[#00ff88] transition-colors text-sm"
              disabled={!onNext}
            >
              ⏭
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full max-w-md">
            <span className="text-[#666] text-xs w-12 font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
            />
            <span className="text-[#666] text-xs w-12 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <span className="text-[#999] text-sm">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
          />
        </div>
      </div>
    </div>
  );
};

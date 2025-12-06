import React, { useState } from 'react';
import { SourceCreateRequest } from '../types';
import { sourceService } from '../api/sourceService';

interface CreateSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateSourceModal: React.FC<CreateSourceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const request: SourceCreateRequest = { name };
      await sourceService.createSource(request);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'FAILED TO CREATE SOURCE');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md">
        <div className="p-6 border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">CREATE SOURCE</h2>
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
              NAME *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
            />
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


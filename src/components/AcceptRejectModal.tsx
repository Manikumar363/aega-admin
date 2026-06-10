import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AcceptRejectModalProps {
  isOpen: boolean;
  type: 'accept' | 'reject';
  universityName: string;
  onConfirm: (reason?: string, notes?: string) => Promise<void>;
  onClose: () => void;
}

const AcceptRejectModal: React.FC<AcceptRejectModalProps> = ({
  isOpen,
  type,
  universityName,
  onConfirm,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);

    try {
      await onConfirm(reason, notes);
      setReason('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isReject = type === 'reject';
  const title = isReject ? 'Reject University' : 'Accept University';
  const buttonColor = isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-[#14123A] p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-white/70 hover:text-white disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-white/80">
          {isReject ? `Are you sure you want to reject ` : `Are you sure you want to accept `}
          <span className="font-semibold text-white">{universityName}</span>?
        </p>

        {isReject && (
          <div className="mb-4 space-y-3">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-white/90 mb-1">
                Reason <span className="text-red-400">*</span>
              </label>
              <input
                id="reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Insufficient documentation"
                className="w-full rounded border border-[#5A6280] bg-[#1a1840] px-3 py-2 text-sm text-white outline-none focus:border-[#F7941D] placeholder:text-white/50"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-white/90 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                rows={3}
                className="w-full rounded border border-[#5A6280] bg-[#1a1840] px-3 py-2 text-sm text-white outline-none focus:border-[#F7941D] placeholder:text-white/50"
              />
            </div>
          </div>
        )}

        {!isReject && (
          <div className="mb-4">
            <label htmlFor="acceptNotes" className="block text-sm font-medium text-white/90 mb-1">
              Notes
            </label>
            <textarea
              id="acceptNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., University has been verified and approved"
              rows={3}
              className="w-full rounded border border-[#5A6280] bg-[#1a1840] px-3 py-2 text-sm text-white outline-none focus:border-[#F7941D] placeholder:text-white/50"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 rounded border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || (isReject && !reason.trim())}
            className={`flex-1 rounded px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-40 ${buttonColor}`}
          >
            {loading ? 'Processing...' : isReject ? 'Reject' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptRejectModal;

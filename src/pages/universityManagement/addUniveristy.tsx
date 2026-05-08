import React, { useState } from 'react';

type AddUniversityProps = {
  onClose: () => void;
};

const AddUniversity: React.FC<AddUniversityProps> = ({ onClose }) => {
  const [universityName, setUniversityName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl border border-[#2E325D] bg-[#14123A] p-4 sm:p-6">
        <h2 className="mb-5 text-3xl font-semibold text-white">Add University</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="university-name" className="mb-2 block text-base text-white">
              University Name<span className="text-[#E03137]">*</span>
            </label>
            <input
              id="university-name"
              type="text"
              value={universityName}
              onChange={(event) => setUniversityName(event.target.value)}
              placeholder="Uni Name"
              required
              className="w-full border border-[#4E5277] bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/50"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-base text-white">
              Message<span className="text-[#E03137]">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message..."
              required
              rows={3}
              className="w-full resize-none border border-[#4E5277] bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
          <button type="button" onClick={onClose} className="w-full bg-[#E5E7EB] py-2.5 text-sm font-semibold text-[#8C95A0] transition-colors hover:bg-[#d9dbe0] sm:w-52">
            Discard
          </button>
          <button type="submit" className="w-full bg-[#F7941D] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e28518] sm:w-52">
            Send Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUniversity;

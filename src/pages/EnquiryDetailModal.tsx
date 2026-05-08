import React, { useState } from 'react';

interface Enquiry {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  subject: string;
}

interface EnquiryDetailModalProps {
  enquiry: Enquiry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({ enquiry, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !enquiry) return null;

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setMessage('');
      setIsSending(false);
      // You can add a toast notification here
    }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-4xl max-h-screen overflow-y-auto bg-[#14112E] rounded-lg text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="sticky top-0 flex justify-end p-4 bg-[#14112E] border-b border-white/10">
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Enquiry Information Section */}
            <div className="bg-[#0a0820] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">ENQUIRY INFORMATION</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <p className="text-white/60 text-sm mb-1">Name :</p>
                    <p className="text-white text-base">{enquiry.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-white/60 text-sm mb-1">Phone Number :</p>
                    <p className="text-white text-base">{enquiry.mobileNumber}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <p className="text-white/60 text-sm mb-1">Email ID :</p>
                    <p className="text-white text-base">{enquiry.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-white/60 text-sm mb-1">Subject :</p>
                    <p className="text-white text-base">{enquiry.subject}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-white/60 text-sm mb-1">Message :</p>
                <p className="text-white text-base">This is the enquiry message from the user.</p>
              </div>
            </div>

            {/* Reply Section */}
            <div className="bg-[#0a0820] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">REPLY</h2>

              <div>
                <label className="text-white/80 text-sm mb-2 block">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full bg-[#03091F] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#F68E2D]/60 focus:bg-white/5 transition resize-none min-h-48"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || isSending}
                  className="bg-[#F68E2D] hover:bg-[#F68E2D]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryDetailModal;

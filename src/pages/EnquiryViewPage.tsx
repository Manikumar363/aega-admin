import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Enquiry {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  subject: string;
}

export const EnquiryViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Mock data - in a real app, you'd fetch this from an API using the id
  const enquiries: Enquiry[] = [
    { id: '0000001', name: 'Liam', mobileNumber: '5506555340', email: 'liam@gmail.com', subject: 'Subject' },
    { id: '0000002', name: 'Mason', mobileNumber: '9876543210', email: 'mason@gmail.com', subject: 'Subject' },
    { id: '0000003', name: 'Liam', mobileNumber: '6543217890', email: 'liam@gmail.com', subject: 'Subject' },
    { id: '0000004', name: 'Liam', mobileNumber: '7890123456', email: 'liam@gmail.com', subject: 'Subject' },
    { id: '0000005', name: 'Mason', mobileNumber: '1234567890', email: 'mason@gmail.com', subject: 'Subject' },
    { id: '0000006', name: 'Mason', mobileNumber: '4567890123', email: 'mason@gmail.com', subject: 'Subject' },
    { id: '0000007', name: 'Liam', mobileNumber: '9876504321', email: 'liam@gmail.com', subject: 'Subject' },
    { id: '0000008', name: 'James', mobileNumber: '2345678901', email: 'james@gmail.com', subject: 'Subject' },
    { id: '0000009', name: 'Sarah', mobileNumber: '3456789012', email: 'sarah@email.com', subject: 'Subject' },
    { id: '0000010', name: 'Michael', mobileNumber: '4567890123', email: 'michael@domain.com', subject: 'Subject' },
  ];

  const enquiry = enquiries.find((e) => e.id === id);

  if (!enquiry) {
    return (
      <div className="min-h-screen bg-[#03091F] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Enquiry Not Found</h2>
          <button
            onClick={() => navigate('/enquiries')}
            className="bg-[#F68E2D] hover:bg-[#F68E2D]/90 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Back to Enquiries
          </button>
        </div>
      </div>
    );
  }

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
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/enquiries')}
            className="mb-4 text-white/60 hover:text-white transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Enquiries
          </button>
          <h1 className="text-4xl font-bold">Enquiry Details</h1>
          <p className="mt-2 text-white/60">Manage and respond to enquiry #{enquiry.id}</p>
        </div>
      </div>

      {/* Enquiry Information Section */}
      <div className="bg-[#14112E] border border-white/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">ENQUIRY INFORMATION</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-8">
              <p className="text-white/60 text-sm mb-2">Name :</p>
              <p className="text-white text-lg">{enquiry.name}</p>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-2">Phone Number :</p>
              <p className="text-white text-lg">{enquiry.mobileNumber}</p>
            </div>
          </div>

          <div>
            <div className="mb-8">
              <p className="text-white/60 text-sm mb-2">Email ID :</p>
              <p className="text-white text-lg">{enquiry.email}</p>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-2">Subject :</p>
              <p className="text-white text-lg">{enquiry.subject}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-white/60 text-sm mb-2">Message :</p>
          <p className="text-white text-lg">This is the enquiry message from the user regarding their query or issue.</p>
        </div>
      </div>

      {/* Reply Section */}
      <div className="bg-[#14112E] border border-white/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">REPLY</h2>

        <div>
          <label className="text-white/80 text-sm mb-3 block font-semibold">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your reply here..."
            className="w-full bg-[#0a0820] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#F68E2D]/60 focus:bg-white/5 transition resize-none min-h-64"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="bg-[#F68E2D] hover:bg-[#F68E2D]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-12 py-3 rounded-lg transition"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnquiryViewPage;

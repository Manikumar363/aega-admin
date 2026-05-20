import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAdminComplaints, mapComplaintToEnquiry, replyToAdminComplaint } from '../services/complaintsApi';
import type { EnquiryRecord } from '../services/complaintsApi';

export const EnquiryViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState('');
  const [enquiry, setEnquiry] = useState<EnquiryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadEnquiry = async () => {
      if (!id) {
        setError('Enquiry id is missing.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const enquiries = await fetchAdminComplaints();
        const matchedEnquiry = enquiries.find((item) => item.id === id) ?? null;

        if (isActive) {
          setEnquiry(matchedEnquiry);
          if (!matchedEnquiry) {
            setError('Enquiry not found.');
          }
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load enquiry');
          setEnquiry(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadEnquiry();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03091F] text-white flex items-center justify-center">
        <div className="text-center text-white/70">Loading enquiry details...</div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="min-h-screen bg-[#03091F] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || 'Enquiry Not Found'}</h2>
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
    if (!id || !message.trim() || isSending) return;

    setIsSending(true);
    setReplyFeedback('');

    try {
      const response = await replyToAdminComplaint(id, message.trim());
      const updatedEnquiry = mapComplaintToEnquiry(response.complaint);

      setEnquiry(updatedEnquiry);
      setMessage('');
      setReplyFeedback(response.message || 'Reply sent successfully.');
    } catch (sendError) {
      setReplyFeedback(sendError instanceof Error ? sendError.message : 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
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
          <p className="mt-2 text-white/60">Manage and respond to enquiry #{enquiry.referenceNumber}</p>
        </div>
      </div>

      {/* Enquiry Information Section */}
      <div className="bg-[#14112E] border border-white/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">ENQUIRY INFORMATION</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-8">
              <p className="text-white/60 text-sm mb-2">Reference Number :</p>
              <p className="text-white text-lg">{enquiry.referenceNumber}</p>
            </div>

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
          <p className="text-white text-lg">{enquiry.message}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-white/60 text-sm mb-2">Country of Residence :</p>
            <p className="text-white text-lg">{enquiry.countryOfResidence}</p>
          </div>

          <div>
            <p className="text-white/60 text-sm mb-2">Agent / Company :</p>
            <p className="text-white text-lg">{enquiry.agentNameOrCompany}</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-white/60 text-sm mb-2">Status :</p>
          <p className="text-white text-lg capitalize">{enquiry.status}</p>
        </div>

        <div className="mt-8">
          <p className="text-white/60 text-sm mb-3">Evidence Files :</p>
          {enquiry.evidenceFiles.length > 0 ? (
            <div className="space-y-2">
              {enquiry.evidenceFiles.map((file) => (
                <a
                  key={file.fileUrl}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[#F68E2D] hover:underline"
                >
                  {file.fileName}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-white text-lg">No evidence files uploaded.</p>
          )}
        </div>

        {(enquiry.replyMessage || enquiry.repliedBy || enquiry.repliedAt) && (
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-white/60 text-sm mb-2">Latest Reply :</p>
            <p className="text-white text-lg">{enquiry.replyMessage || 'No reply message available.'}</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/60">
              {enquiry.repliedBy && <span>Replied By: {enquiry.repliedBy}</span>}
              {enquiry.repliedAt && <span>Replied At: {new Date(enquiry.repliedAt).toLocaleString()}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Reply Section */}
      <div className="bg-[#14112E] border border-white/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">REPLY</h2>

        {replyFeedback && (
          <div className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            {replyFeedback}
          </div>
        )}

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

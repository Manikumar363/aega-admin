import React, { useEffect, useState } from 'react';
import { fetchAdminStudentById, type AdminStudentRecord } from '../../services/adminManagementApi';

type ViewStudentProps = {
  studentId: string;
};

export const ViewStudent: React.FC<ViewStudentProps> = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'preferences'>('info');
  const [studentData, setStudentData] = useState<AdminStudentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudentDetails = async () => {
      if (!studentId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAdminStudentById(studentId);
        setStudentData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch student details.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadStudentDetails();
  }, [studentId]);

  const getEligibilityStyle = (status: string = 'TBD') => {
    const cleanStatus = status.trim().toUpperCase();
    if (cleanStatus === 'ELIGIBLE') {
      return { bg: 'bg-[#1B2C24] text-[#4ADE80] border-[#22C55E]/10', bullet: 'bg-[#4ADE80]' };
    }
    if (cleanStatus === 'HOSTILE') {
      return { bg: 'bg-[#3F1E24] text-[#F87171] border-[#EF4444]/10', bullet: 'bg-[#F87171]' };
    }
    if (cleanStatus === 'NONE') {
      return { bg: 'bg-[#1E1E2F] text-gray-400 border-gray-500/20', bullet: 'bg-gray-400' };
    }
    // Default to TBD
    return { bg: 'bg-[#3F351E] text-[#FBBF24] border-[#F59E0B]/10', bullet: 'bg-[#FBBF24]' };
  };

  const getApplicationStyle = (status: string = 'ON-GOING') => {
    const cleanStatus = status.trim().toUpperCase();
    if (cleanStatus === 'ACCEPTED') {
      return { bg: 'bg-[#1B2C24] text-[#4ADE80] border-[#22C55E]/10', bullet: 'bg-[#4ADE80]' };
    }
    if (cleanStatus === 'REJECTED') {
      return { bg: 'bg-[#3F1E24] text-[#F87171] border-[#EF4444]/10', bullet: 'bg-[#F87171]' };
    }
    if (cleanStatus === 'CONDITIONAL OFFER' || cleanStatus === 'CONDITIONAL') {
      return { bg: 'bg-[#2E1E3F] text-[#C084FC] border-[#C084FC]/10', bullet: 'bg-[#C084FC]' };
    }
    // Default to ON-GOING
    return { bg: 'bg-[#3F351E] text-[#FBBF24] border-[#F59E0B]/10', bullet: 'bg-[#FBBF24]' };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-white">
        <svg className="animate-spin h-8 w-8 text-[#F68E2D]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
        {error || 'Student not found.'}
      </div>
    );
  }

  const tenth = studentData.tenthInformation?.[0] as any;
  const twelfth = studentData.twelfthInformation?.[0] as any;
  const grad = studentData.graduationInformation?.[0] as any;

  return (
    <div className="space-y-6">
      {/* Tabs Menu */}
      <div className="flex items-center justify-between border-b border-[#F68E2D] pb-2 mb-6">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`font-semibold pb-2 border-b-2 ${
              activeTab === 'info' ? 'text-[#F68E2D] border-[#F68E2D]' : 'text-white border-transparent'
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`font-semibold pb-2 border-b-2 ${
              activeTab === 'preferences' ? 'text-[#F68E2D] border-[#F68E2D]' : 'text-white border-transparent'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {activeTab === 'info' ? (
        <div className="space-y-6 text-white text-sm">
          {/* Basic Information */}
          <div className="bg-[#14112E] rounded border border-[#2C2A45] p-6.5">
            <h2 className="text-white text-base font-bold tracking-wide mb-6 uppercase">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">First Name :</span>
                <span className="ml-2 font-medium">{studentData.firstName || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Last Name :</span>
                <span className="ml-2 font-medium">{studentData.lastName || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Email ID :</span>
                <span className="ml-2 font-medium">{studentData.emailId || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Phone Number :</span>
                <span className="ml-2 font-medium">{studentData.mobileNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* 10th Educational Information */}
          <div className="bg-[#14112E] rounded border border-[#2C2A45] p-6.5">
            <h2 className="text-white text-base font-bold tracking-wide mb-6 uppercase">10th Educational Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">School :</span>
                <span className="ml-2 font-medium">{tenth?.schoolOrCollege || tenth?.school || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Board Name :</span>
                <span className="ml-2 font-medium">{tenth?.boardOrUniversity || tenth?.board || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Percentage :</span>
                <span className="ml-2 font-medium">{tenth?.cgpaOrPercentage || tenth?.percentage || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Year :</span>
                <span className="ml-2 font-medium">{tenth?.yearOfPassing || tenth?.year || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* 12th Educational Information */}
          <div className="bg-[#14112E] rounded border border-[#2C2A45] p-6.5">
            <h2 className="text-white text-base font-bold tracking-wide mb-6 uppercase">12th Educational Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">School :</span>
                <span className="ml-2 font-medium">{twelfth?.schoolOrCollege || twelfth?.school || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Board Name :</span>
                <span className="ml-2 font-medium">{twelfth?.boardOrUniversity || twelfth?.board || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Percentage :</span>
                <span className="ml-2 font-medium">{twelfth?.cgpaOrPercentage || twelfth?.percentage || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Year :</span>
                <span className="ml-2 font-medium">{twelfth?.yearOfPassing || twelfth?.year || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Graduation Educational Information */}
          <div className="bg-[#14112E] rounded border border-[#2C2A45] p-6.5">
            <h2 className="text-white text-base font-bold tracking-wide mb-6 uppercase">Graduation Educational Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">College :</span>
                <span className="ml-2 font-medium">{grad?.schoolOrCollege || grad?.college || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">University :</span>
                <span className="ml-2 font-medium">{grad?.boardOrUniversity || grad?.university || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">Major :</span>
                <span className="ml-2 font-medium">{grad?.streamOrSpecialization || grad?.major || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-400 w-32">CGPA :</span>
                <span className="ml-2 font-medium">{grad?.cgpaOrPercentage || grad?.cgpa || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Preferences Tab Table */
        <div className="overflow-hidden border border-[#8A91AC] bg-[#14112E]">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-0 min-w-225">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[25%]" />
                <col className="w-[30%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#8A91AC] text-sm font-semibold text-white">
                  <th className="border-r border-[#8A91AC] px-4 py-4 text-center">Image</th>
                  <th className="border-r border-[#8A91AC] px-4 py-4 text-center">Name</th>
                  <th className="border-r border-[#8A91AC] px-4 py-4 text-center">Course Name</th>
                  <th className="border-r border-[#8A91AC] px-4 py-4 text-center">Eligibility Status</th>
                  <th className="border-r border-[#8A91AC] px-4 py-4 text-center">Application Status</th>
                  <th className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {studentData.universitiesPreferences && studentData.universitiesPreferences.length > 0 ? (
                  studentData.universitiesPreferences.map((pref) => {
                    const elStyle = getEligibilityStyle(pref.eligibilityStatus);
                    const appStyle = getApplicationStyle(pref.applicationStatus);
                    return (
                      <tr key={pref._id} className="text-sm text-white/95">
                        <td className="border-r border-b border-[#6A708D] px-6 py-4">
                          <div className="flex justify-center">
                            <img
                              src={pref.logoUrl || '/avatar.jpg'}
                              alt={pref.universityName}
                              className="h-8 w-8 rounded-full border border-white/20 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/avatar.jpg';
                              }}
                            />
                          </div>
                        </td>
                        <td className="border-r border-b border-[#6A708D] px-6 py-4 text-center truncate">{pref.universityName}</td>
                        <td className="border-r border-b border-[#6A708D] px-6 py-4 text-center truncate">{pref.courseName}</td>
                        <td className="border-r border-b border-[#6A708D] px-6 py-4">
                          <div className="flex justify-center">
                            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold gap-1.5 border ${elStyle.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${elStyle.bullet}`}></span>
                              <span>{pref.eligibilityStatus || 'TBD'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="border-r border-b border-[#6A708D] px-6 py-4">
                          <div className="flex justify-center">
                            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold gap-1.5 border ${appStyle.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${appStyle.bullet}`}></span>
                              <span>{pref.applicationStatus || 'On-Going'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[#6A708D] px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7941D] hover:bg-[#e28518] transition-colors"
                              title="View"
                            >
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F5AE6] hover:bg-[#334bd0] transition-colors"
                              title="Edit"
                            >
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L12 14l-4 1 1-4 7.5-7.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ED3941] hover:bg-[#d1323a] transition-colors"
                              title="Delete"
                            >
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-white/50">
                      No preferences found for this student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;

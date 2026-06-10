import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCDPCourseById } from '../services/cdpTrainingApi';
import type { CDPCourse } from '../services/cdpTrainingApi';

const ViewCDPTraining: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CDPCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) {
        setError('Course ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const courseData = await getCDPCourseById(courseId);
        setCourse(courseData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load course';
        setError(message);
        console.error('Error loading course:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold">Course Details</h1>
          <p className="mt-2 text-sm text-white/70">View course information.</p>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold">Course Details</h1>
          <p className="mt-2 text-sm text-white/70">View course information.</p>
        </div>
        <div className="text-center py-8 text-red-500">Error: {error || 'Course not found'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">{course.courseName || course.name}</h1>
        <p className="mt-2 text-sm text-white/70">View course information.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6">
        {course.coverPicture && (
          <div className="w-full">
            <img 
              src={course.coverPicture} 
              alt={course.courseName}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">Course Name</label>
            <p className="text-lg">{course.courseName || course.name}</p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">Type</label>
            <p className="text-lg capitalize">{course.type}</p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">Duration</label>
            <p className="text-lg">{course.timeInHr || course.time} hours</p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">Number of Modules</label>
            <p className="text-lg">{course.modules}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-white/70">Course Link</label>
            <a 
              href={course.hyperLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#F68E2D] hover:underline break-all"
            >
              {course.hyperLink}
            </a>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-white/70">Description</label>
            <p className="text-white/80 whitespace-pre-wrap">{course.description}</p>
          </div>
        </div>

        {course.createdAt && (
          <div className="border-t border-white/10 pt-4 text-sm text-white/50">
            <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
            {course.updatedAt && (
              <p>Updated: {new Date(course.updatedAt).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6">
        <button 
          onClick={() => navigate('/cdp')} 
          className="min-w-45 border border-[#F68E2D] bg-white px-6 py-3 text-sm font-medium text-[#B8BDC7]"
        >
          Back
        </button>
        <button 
          onClick={() => navigate(`/cdp/edit/${course._id || course.id}`)}
          className="min-w-45 bg-[#F68E2D] px-6 py-3 text-sm font-semibold text-white"
        >
          Edit Course
        </button>
      </div>
    </div>
  );
};

export default ViewCDPTraining;

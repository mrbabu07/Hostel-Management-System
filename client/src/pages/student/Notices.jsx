import { useState, useEffect } from 'react';
import ModernLayout from '../../components/layout/ModernLayout';
import { noticesService } from '../../services/notices.service';
import { BellAlertIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchNotices();
  }, [priorityFilter]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (priorityFilter) params.priority = priorityFilter;

      const response = await noticesService.getAllNotices(params);
      setNotices(response.data.notices || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-rose-500 bg-rose-50 dark:bg-rose-500/10',
      medium: 'border-warning-500 bg-warning-50 dark:bg-warning-500/10',
      low: 'border-primary-500 bg-primary-50 dark:bg-primary-500/10',
    };
    return colors[priority] || colors.low;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'badge-danger',
      medium: 'badge-warning',
      low: 'badge-primary',
    };
    return badges[priority] || badges.low;
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <ModernLayout>
      <div>
        {/* Header */}
        <div className="mb-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/30">
          <h1 className="text-4xl font-bold mb-2">Notices 📢</h1>
          <p className="text-purple-100">Stay updated with important announcements</p>
        </div>

        {/* Filter */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            <FunnelIcon className="w-5 h-5 text-secondary-500" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input flex-1"
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="card p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto" />
            <p className="text-secondary-600 dark:text-secondary-400 mt-4">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
              <BellAlertIcon className="w-10 h-10 text-secondary-400" />
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 text-lg">No notices available</p>
            <p className="text-secondary-500 text-sm mt-2">Check back later for updates</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice, index) => (
              <div
                key={notice._id}
                className={`card border-l-4 ${getPriorityColor(notice.priority)} hover:shadow-lg transition-all`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                          {notice.title}
                        </h3>
                        <span className={`${getPriorityBadge(notice.priority)} capitalize`}>
                          {notice.priority}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-500">
                        {getTimeAgo(notice.createdAt)} • Posted by {notice.createdBy?.name || 'Admin'}
                      </p>
                    </div>
                  </div>
                  <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                    {notice.content}
                  </p>
                  {notice.expiryDate && (
                    <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                      <p className="text-sm text-secondary-500">
                        Valid until: {new Date(notice.expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModernLayout>
  );
};

export default Notices;

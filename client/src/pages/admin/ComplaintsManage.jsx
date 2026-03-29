import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { complaintsService } from "../../services/complaints.service";
import { formatDateTime } from "../../utils/formatDate";
import {
  ExclamationTriangleIcon,
  FunnelIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const ComplaintsManage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsService.getAllComplaints(
        statusFilter,
        categoryFilter,
      );
      console.log('All complaints response:', response.data);
      const complaintsData = response.data.complaints || response.data.data || response.data || [];
      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await complaintsService.updateComplaintStatus(selectedComplaint._id, {
        status,
        adminNotes: adminNote,
      });
      setIsModalOpen(false);
      setSelectedComplaint(null);
      setAdminNote("");
      fetchComplaints();
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Failed to update complaint");
    }
  };

  const openComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setAdminNote(complaint.adminNote || complaint.adminNotes || "");
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-50/80 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/30",
      "in-progress": "bg-blue-50/80 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/30",
      resolved: "bg-emerald-50/80 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/30",
      rejected: "bg-rose-50/80 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/30",
    };
    return colors[status] || "bg-secondary-100/80 dark:bg-secondary-700/80 text-secondary-600 dark:text-secondary-400 border-secondary-200/50 dark:border-secondary-600/50";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="w-4 h-4" />;
      case "in-progress":
        return <ChatBubbleLeftIcon className="w-4 h-4" />;
      case "resolved":
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
  };

  if (loading && complaints.length === 0) {
    return (
      <ModernLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-premium-lg animate-gradient" style={{ backgroundSize: '200% 200%' }}>
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Complaints Management 📋</h1>
              <p className="text-white/90 text-lg">
                Review and manage student complaints
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FunnelIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold gradient-text">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                <option value="food">Food</option>
                <option value="room">Room</option>
                <option value="maintenance">Maintenance</option>
                <option value="hygiene">Hygiene</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ExclamationTriangleIcon className="w-20 h-20 mx-auto text-secondary-300 dark:text-secondary-600 mb-4 animate-float" />
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            No Complaints Found
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            There are no complaints matching your filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint, index) => (
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="glass-card p-6 hover-lift hover-glow cursor-pointer"
                onClick={() => openComplaint(complaint)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                      {complaint.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                      <UserIcon className="w-4 h-4" />
                      <span>By: {complaint.userId?.name || complaint.student?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{formatDateTime(complaint.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-lg shadow-sm capitalize ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      {complaint.status}
                    </span>
                    <span className="px-3 py-1.5 bg-purple-50/80 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold border border-purple-200/50 dark:border-purple-500/30 backdrop-blur-lg capitalize">
                      {complaint.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-secondary-600 dark:text-secondary-400">
                  {complaint.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Complaint Details Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">Complaint Details</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedComplaint(null);
                }}
                className="p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-lg hover:bg-secondary-100/50 dark:hover:bg-secondary-700/50 transition-all duration-300 hover:scale-110"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Complaint Info */}
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                  {selectedComplaint.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-lg shadow-sm capitalize ${getStatusColor(selectedComplaint.status)}`}>
                    {getStatusIcon(selectedComplaint.status)}
                    {selectedComplaint.status}
                  </span>
                  <span className="px-3 py-1.5 bg-purple-50/80 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold border border-purple-200/50 dark:border-purple-500/30 backdrop-blur-lg capitalize">
                    {selectedComplaint.category}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                    selectedComplaint.priority === 'high' 
                      ? 'bg-rose-50/80 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/30'
                      : selectedComplaint.priority === 'medium'
                      ? 'bg-amber-50/80 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/30'
                      : 'bg-secondary-100/80 dark:bg-secondary-700/80 text-secondary-600 dark:text-secondary-400 border border-secondary-200/50 dark:border-secondary-600/50'
                  } backdrop-blur-lg`}>
                    {selectedComplaint.priority} priority
                  </span>
                </div>
                <div className="p-4 bg-secondary-50/80 dark:bg-secondary-700/60 backdrop-blur-lg rounded-xl border border-secondary-200/50 dark:border-secondary-600/50 mb-4">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    <span className="font-semibold">Submitted by:</span> {selectedComplaint.userId?.name || selectedComplaint.student?.name || 'Unknown'} ({selectedComplaint.userId?.email || selectedComplaint.student?.email || 'N/A'})
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    <span className="font-semibold">Date:</span> {formatDateTime(selectedComplaint.createdAt)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Description
                </h4>
                <div className="p-4 bg-white/60 dark:bg-secondary-800/60 backdrop-blur-lg rounded-xl border border-secondary-200/50 dark:border-secondary-700/50">
                  <p className="text-secondary-700 dark:text-secondary-300">
                    {selectedComplaint.description}
                  </p>
                </div>
              </div>

              {/* Admin Note */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Admin Note
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder="Add notes for this complaint..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => handleUpdateStatus("in-progress")}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus("resolved")}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-rose-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </ModernLayout>
  );
};

export default ComplaintsManage;

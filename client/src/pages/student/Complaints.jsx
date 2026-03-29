import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { complaintsService } from "../../services/complaints.service";
import { formatDateTime } from "../../utils/formatDate";
import {
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "food",
    title: "",
    description: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsService.getMyComplaints();
      console.log('My complaints response:', response.data);
      const complaintsData = response.data.complaints || response.data.data || response.data || [];
      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      await complaintsService.createComplaint(formData);
      setIsModalOpen(false);
      setFormData({
        category: "food",
        title: "",
        description: "",
        priority: "medium",
      });
      setError("");
      fetchComplaints();
    } catch (error) {
      console.error("Error creating complaint:", error);
      setError(error.response?.data?.message || "Failed to create complaint");
    } finally {
      setLoading(false);
    }
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

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-secondary-600",
      medium: "text-amber-600",
      high: "text-rose-600",
    };
    return colors[priority] || "text-secondary-600";
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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ExclamationTriangleIcon className="w-10 h-10" />
                <h1 className="text-4xl font-bold">My Complaints</h1>
              </div>
              <p className="text-white/90 text-lg">
                Submit and track your complaints
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              New Complaint
            </button>
          </div>
        </div>
      </motion.div>

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ExclamationTriangleIcon className="w-20 h-20 mx-auto text-secondary-300 dark:text-secondary-600 mb-4 animate-float" />
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            No Complaints Yet
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Submit your first complaint to get started
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <PlusIcon className="w-5 h-5" />
            New Complaint
          </button>
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
              <div className="glass-card p-6 hover-lift hover-glow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex-1">
                    {complaint.title}
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-lg shadow-sm capitalize ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </span>
                </div>
                
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  {complaint.description}
                </p>
                
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50/80 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full border border-purple-200/50 dark:border-purple-500/30 backdrop-blur-lg font-medium capitalize">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    {complaint.category}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium capitalize ${getPriorityColor(complaint.priority)}`}>
                    <span className={`w-2 h-2 rounded-full ${complaint.priority === 'high' ? 'bg-rose-500' : complaint.priority === 'medium' ? 'bg-amber-500' : 'bg-secondary-500'}`}></span>
                    {complaint.priority} priority
                  </span>
                  <span className="text-secondary-500">
                    {formatDateTime(complaint.createdAt)}
                  </span>
                </div>
                
                {complaint.adminNotes && (
                  <div className="mt-4 p-4 bg-blue-50/80 dark:bg-blue-500/20 backdrop-blur-lg rounded-xl border-l-4 border-blue-500 shadow-sm">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      Admin Response:
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{complaint.adminNotes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">New Complaint</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError("");
                }}
                className="p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-lg hover:bg-secondary-100/50 dark:hover:bg-secondary-700/50 transition-all duration-300 hover:scale-110"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50/80 dark:bg-red-500/20 backdrop-blur-lg text-red-700 dark:text-red-400 rounded-xl border border-red-200/50 dark:border-red-500/30">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="input"
                  required
                >
                  <option value="food">Food</option>
                  <option value="room">Room</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="input"
                  placeholder="Brief title (min 3 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input resize-none"
                  rows="4"
                  required
                  placeholder="Detailed description (min 10 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </ModernLayout>
  );
};

export default Complaints;

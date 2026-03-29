import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { noticesService } from "../../services/notices.service";
import { formatDateTime } from "../../utils/formatDate";
import {
  BellAlertIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const NoticesManage = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: "all",
    isPinned: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await noticesService.getAllNotices();
      console.log('Notices response:', response.data);
      // Handle different response structures
      const noticesData = response.data.notices || response.data.data || response.data || [];
      setNotices(Array.isArray(noticesData) ? noticesData : []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await noticesService.updateNotice(editingNotice._id, formData);
      } else {
        await noticesService.createNotice(formData);
      }
      setIsModalOpen(false);
      setEditingNotice(null);
      setFormData({ title: "", content: "", audience: "all", isPinned: false });
      fetchNotices();
    } catch (error) {
      console.error("Error saving notice:", error);
      alert("Failed to save notice");
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      targetAudience: notice.targetAudience || notice.audience || "all",
      isPinned: notice.isPinned,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      await noticesService.deleteNotice(id);
      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice");
    }
  };

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({ title: "", content: "", targetAudience: "all", isPinned: false });
    setIsModalOpen(true);
  };

  const getAudienceColor = (audience) => {
    const aud = audience || 'all';
    switch (aud) {
      case "all":
        return "bg-blue-50/80 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/30";
      case "student":
      case "students":
        return "bg-emerald-50/80 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/30";
      case "manager":
      case "managers":
        return "bg-amber-50/80 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/30";
      default:
        return "bg-secondary-100/80 dark:bg-secondary-700/80 text-secondary-600 dark:text-secondary-400 border-secondary-200/50 dark:border-secondary-600/50";
    }
  };

  if (loading) {
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
                <BellAlertIcon className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Notices Management 📢</h1>
              </div>
              <p className="text-white/90 text-lg">
                Create and manage announcements for users
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="btn-secondary flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Create Notice
            </button>
          </div>
        </div>
      </motion.div>

      {/* Notices List */}
      {notices.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <BellAlertIcon className="w-20 h-20 mx-auto text-secondary-300 dark:text-secondary-600 mb-4 animate-float" />
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            No Notices Found
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Create your first notice to get started
          </p>
          <button onClick={openCreateModal} className="btn-primary">
            <PlusIcon className="w-5 h-5" />
            Create Notice
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice, index) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="glass-card p-6 hover-lift hover-glow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                        {notice.title}
                      </h3>
                      {notice.isPinned && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50/80 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-200/50 dark:border-amber-500/30 backdrop-blur-lg shadow-sm">
                          <MapPinIcon className="w-3 h-3" />
                          Pinned
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-lg shadow-sm capitalize ${getAudienceColor(notice.targetAudience || notice.audience)}`}>
                        {notice.targetAudience || notice.audience}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                      Posted by: {notice.createdBy?.name || 'Admin'} | {formatDateTime(notice.createdAt)}
                    </p>
                    <p className="text-secondary-700 dark:text-secondary-300">
                      {notice.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                {editingNotice ? "Edit Notice" : "Create Notice"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingNotice(null);
                }}
                className="p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-lg hover:bg-secondary-100/50 dark:hover:bg-secondary-700/50 transition-all duration-300 hover:scale-110"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter notice title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  rows={5}
                  className="input resize-none"
                  placeholder="Enter notice content"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Audience
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  className="input"
                >
                  <option value="all">All Users</option>
                  <option value="students">Students Only</option>
                  <option value="managers">Managers Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) =>
                    setFormData({ ...formData, isPinned: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 bg-white/80 border-secondary-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="isPinned" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Pin this notice
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingNotice(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingNotice ? "Update Notice" : "Create Notice"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </ModernLayout>
  );
};

export default NoticesManage;

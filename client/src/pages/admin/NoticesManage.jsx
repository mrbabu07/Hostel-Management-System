import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { noticesService } from "../../services/notices.service";
import { formatDateTime } from "../../utils/formatDate";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";

const NoticesManage = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "all",
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
      const noticesData = Array.isArray(response.data) ? response.data : [];
      setNotices(noticesData);
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
      audience: notice.audience,
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
    setFormData({ title: "", content: "", audience: "all", isPinned: false });
    setIsModalOpen(true);
  };

  return (
    <AppLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notices Management</h1>
          <Button onClick={openCreateModal}>Create Notice</Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No notices found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{notice.title}</h3>
                      {notice.isPinned && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          Pinned
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                        {notice.audience}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Posted by: {notice.createdBy?.name} |{" "}
                      {formatDateTime(notice.createdAt)}
                    </p>
                    <p className="text-gray-700">{notice.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingNotice(null);
          }}
          title={editingNotice ? "Edit Notice" : "Create Notice"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                rows="5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Audience</label>
              <select
                value={formData.audience}
                onChange={(e) =>
                  setFormData({ ...formData, audience: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="all">All Users</option>
                <option value="student">Students Only</option>
                <option value="manager">Managers Only</option>
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
                className="w-4 h-4"
              />
              <label htmlFor="isPinned" className="text-sm font-medium">
                Pin this notice
              </label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingNotice(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingNotice ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default NoticesManage;

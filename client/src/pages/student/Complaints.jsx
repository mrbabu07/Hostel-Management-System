import { useEffect, useState } from "react";
import ModernLayout from "../../components/layout/ModernLayout";
import { complaintsService } from "../../services/complaints.service";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { formatDateTime } from "../../utils/formatDate";

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
      const response = await complaintsService.getMyComplaints();
      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
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
      pending: "badge-warning",
      "in-progress": "badge-primary",
      resolved: "badge-success",
    };
    return colors[status] || "badge bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300";
  };

  return (
    <ModernLayout>
      <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">My Complaints</h1>
            <p className="text-secondary-600 dark:text-secondary-400 mt-1">Submit and track your complaints</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>New Complaint</Button>
        </div>
      </div>

        {complaints.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 text-lg">No complaints yet</p>
            <p className="text-secondary-500 text-sm mt-2">Submit your first complaint to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="card p-6 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{complaint.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p className="text-secondary-600 dark:text-secondary-400 mb-3">{complaint.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary-500">
                  <span className="capitalize flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                    {complaint.category}
                  </span>
                  <span className="capitalize flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-warning-500"></span>
                    {complaint.priority}
                  </span>
                  <span>{formatDateTime(complaint.createdAt)}</span>
                </div>
                {complaint.adminNotes && (
                  <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-500/10 rounded-lg border-l-4 border-primary-500">
                    <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-1">Admin Notes:</p>
                    <p className="text-sm text-primary-700 dark:text-primary-300">{complaint.adminNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setError("");
          }}
          title="New Complaint"
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="food">Food</option>
                <option value="room">Room</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Brief title (min 3 characters)"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                required
                placeholder="Detailed description (min 10 characters)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </Modal>
      </div>
    </ModernLayout>
  );
};

export default Complaints;

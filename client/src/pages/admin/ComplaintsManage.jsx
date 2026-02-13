import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { complaintsService } from "../../services/complaints.service";
import { formatDateTime } from "../../utils/formatDate";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

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
      const complaintsData = Array.isArray(response.data) ? response.data : [];
      setComplaints(complaintsData);
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
        adminNote,
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
    setAdminNote(complaint.adminNote || "");
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Complaints Management</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                <option value="food-quality">Food Quality</option>
                <option value="service">Service</option>
                <option value="hygiene">Hygiene</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No complaints found
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => openComplaint(complaint)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{complaint.title}</h3>
                      <p className="text-sm text-gray-600">
                        By: {complaint.userId?.name} |{" "}
                        {formatDateTime(complaint.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-sm capitalize ${getStatusColor(complaint.status)}`}
                      >
                        {complaint.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm capitalize">
                        {complaint.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {complaint.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedComplaint(null);
          }}
          title="Complaint Details"
        >
          {selectedComplaint && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedComplaint.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Category:{" "}
                  <span className="capitalize">
                    {selectedComplaint.category}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Submitted by: {selectedComplaint.userId?.name} (
                  {selectedComplaint.userId?.email})
                </p>
                <p className="text-sm text-gray-600">
                  Date: {formatDateTime(selectedComplaint.createdAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {selectedComplaint.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Admin Note
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Add notes for this complaint..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Update Status
                </label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateStatus("in-progress")}
                    variant="secondary"
                  >
                    In Progress
                  </Button>
                  <Button onClick={() => handleUpdateStatus("resolved")}>
                    Resolve
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus("rejected")}
                    variant="secondary"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ComplaintsManage;

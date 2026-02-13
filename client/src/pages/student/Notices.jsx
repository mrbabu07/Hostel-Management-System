import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { noticesService } from "../../services/notices.service";
import { formatDateTime } from "../../utils/formatDate";
import { Pin } from "lucide-react";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await noticesService.getAllNotices();
      setNotices(response.data.notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "bg-blue-100 text-blue-800",
      urgent: "bg-red-100 text-red-800",
      event: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Notices</h1>

        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className={`bg-white rounded-lg shadow p-6 ${notice.isPinned ? "border-l-4 border-blue-500" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {notice.isPinned && <Pin className="w-5 h-5 text-blue-500" />}
                  <h3 className="text-lg font-semibold">{notice.title}</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm ${getCategoryColor(notice.category)}`}
                >
                  {notice.category}
                </span>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                {notice.content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Posted by: {notice.createdBy?.name}</span>
                <span>{formatDateTime(notice.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Notices;

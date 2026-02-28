import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { auditService } from "../../services/audit.service";
import { Shield, Filter, Download, Search } from "lucide-react";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });

  useEffect(() => {
    fetchLogs();
  }, [filters.action, filters.entityType, filters.startDate, filters.endDate, filters.page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await auditService.getAuditLogs(filters);
      setLogs(response.data?.logs || []);
      setPagination(response.data?.pagination || { total: 0, page: 1, pages: 1 });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await auditService.exportAuditLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting logs:", error);
      alert("Failed to export logs");
    }
  };

  const getActionBadge = (action) => {
    const variants = {
      CREATE: "bg-green-100 text-green-700",
      UPDATE: "bg-blue-100 text-blue-700",
      DELETE: "bg-red-100 text-red-700",
      LOGIN: "bg-gray-100 text-gray-700",
      LOGOUT: "bg-gray-100 text-gray-700",
      STATUS_CHANGE: "bg-yellow-100 text-yellow-700",
      SETTINGS_UPDATE: "bg-purple-100 text-purple-700",
      BILL_GENERATE: "bg-green-100 text-green-700",
    };
    return variants[action] || "bg-gray-100 text-gray-700";
  };

  return (
    <ModernLayout>
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 mb-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Audit Logs</h1>
              </div>
              <p className="text-white/90 text-lg">
                Track all system activities and user actions
              </p>
            </div>
            <button
              onClick={handleExport}
              className="bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="STATUS_CHANGE">Status Change</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>

            <select
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              value={filters.entityType}
              onChange={(e) => setFilters({ ...filters, entityType: e.target.value, page: 1 })}
            >
              <option value="">All Entities</option>
              <option value="User">User</option>
              <option value="Menu">Menu</option>
              <option value="Complaint">Complaint</option>
              <option value="Settings">Settings</option>
              <option value="Bill">Bill</option>
              <option value="Inventory">Inventory</option>
            </select>

            <input
              type="date"
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
              placeholder="From"
            />

            <input
              type="date"
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
              placeholder="To"
            />
          </div>
        </motion.div>

        {/* Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No audit logs found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-violet-50 to-purple-50 border-b-2 border-violet-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Timestamp
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Actor
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Entity
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log, index) => (
                      <motion.tr
                        key={log._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-violet-50/50 transition-all"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {log.userId?.name || "System"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionBadge(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.entityType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {log.description || JSON.stringify(log.details).substring(0, 50)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.ipAddress || "N/A"}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * filters.limit + 1} to{" "}
                  {Math.min(pagination.page * filters.limit, pagination.total)} of{" "}
                  {pagination.total} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={pagination.page >= pagination.pages}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </ModernLayout>
  );
};

export default AuditLogs;

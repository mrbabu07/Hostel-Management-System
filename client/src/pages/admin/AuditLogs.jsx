import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { Shield, Filter, Download } from "lucide-react";

const AuditLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      actor: "Admin User",
      action: "SETTINGS_UPDATE",
      entityType: "Settings",
      description: "Updated meal prices",
      timestamp: "2024-01-15 10:30:00",
      ipAddress: "192.168.1.1",
    },
    {
      id: 2,
      actor: "Manager User",
      action: "CREATE",
      entityType: "Menu",
      description: "Created menu for 2024-01-16",
      timestamp: "2024-01-15 09:15:00",
      ipAddress: "192.168.1.2",
    },
    {
      id: 3,
      actor: "Admin User",
      action: "STATUS_CHANGE",
      entityType: "Complaint",
      description: "Changed complaint status to RESOLVED",
      timestamp: "2024-01-15 08:45:00",
      ipAddress: "192.168.1.1",
    },
  ]);

  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
    from: "",
    to: "",
  });

  const getActionBadge = (action) => {
    const variants = {
      CREATE: "success",
      UPDATE: "info",
      DELETE: "danger",
      LOGIN: "default",
      LOGOUT: "default",
      STATUS_CHANGE: "warning",
      SETTINGS_UPDATE: "purple",
      BILL_GENERATE: "success",
    };
    return variants[action] || "default";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Audit Logs</h1>
              <p className="text-gray-600">Track all system activities</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="px-3 py-2 border rounded-lg"
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value })
              }
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="STATUS_CHANGE">Status Change</option>
            </select>

            <select
              className="px-3 py-2 border rounded-lg"
              value={filters.entityType}
              onChange={(e) =>
                setFilters({ ...filters, entityType: e.target.value })
              }
            >
              <option value="">All Entities</option>
              <option value="User">User</option>
              <option value="Menu">Menu</option>
              <option value="Complaint">Complaint</option>
              <option value="Settings">Settings</option>
            </select>

            <input
              type="date"
              className="px-3 py-2 border rounded-lg"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              placeholder="From"
            />

            <input
              type="date"
              className="px-3 py-2 border rounded-lg"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              placeholder="To"
            />
          </div>
        </Card>

        {/* Logs Table */}
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Actor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.actor}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getActionBadge(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.entityType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1 to 3 of 3 results</p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded hover:bg-gray-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AuditLogs;

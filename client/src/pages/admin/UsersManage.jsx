import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";

const UsersManage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "student",
      rollNumber: "2024001",
      isActive: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "manager",
      isActive: true,
    },
    {
      id: 3,
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "student",
      rollNumber: "2024002",
      isActive: false,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    rollNumber: "",
    roomNumber: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)),
      );
    } else {
      setUsers([...users, { id: Date.now(), ...formData, isActive: true }]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "student",
      rollNumber: "",
      roomNumber: "",
      phone: "",
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
    );
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "student",
      rollNumber: "",
      roomNumber: "",
      phone: "",
    });
    setIsModalOpen(true);
  };

  return (
    <AppLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={openCreateModal}>Add User</Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.rollNumber || "N/A"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`px-2 py-1 rounded text-sm ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          title={editingUser ? "Edit User" : "Add User"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="student">Student</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {formData.role === "student" && (
              <>
                <Input
                  label="Roll Number"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                />
                <Input
                  label="Room Number"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                />
              </>
            )}
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editingUser ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default UsersManage;

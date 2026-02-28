import { useEffect, useState } from "react";
import ModernLayout from "../../components/layout/ModernLayout";
import { menuService } from "../../services/menu.service";
import { toISODate } from "../../utils/formatDate";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";

const MenuManage = () => {
  const [menus, setMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: toISODate(new Date()),
    mealType: "breakfast",
    items: [{ name: "", description: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, [selectedDate]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await menuService.getMenus(selectedDate);
      const menusData = Array.isArray(response.data) ? response.data : [];
      setMenus(menusData);
    } catch (error) {
      console.error("Error fetching menus:", error);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", description: "" }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingMenu) {
        await menuService.updateMenu(editingMenu._id, formData);
      } else {
        await menuService.createMenu(formData);
      }
      setIsModalOpen(false);
      setEditingMenu(null);
      setFormData({
        date: toISODate(new Date()),
        mealType: "breakfast",
        items: [{ name: "", description: "" }],
      });
      fetchMenus();
    } catch (error) {
      console.error("Error saving menu:", error);
      alert(error.message || "Failed to save menu");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      date: menu.date.split("T")[0],
      mealType: menu.mealType,
      items: menu.items,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this menu?")) return;
    try {
      await menuService.deleteMenu(id);
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("Failed to delete menu");
    }
  };

  const openCreateModal = () => {
    setEditingMenu(null);
    setFormData({
      date: selectedDate,
      mealType: "breakfast",
      items: [{ name: "", description: "" }],
    });
    setIsModalOpen(true);
  };

  return (
    <ModernLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <Button onClick={openCreateModal}>Create Menu</Button>
        </div>

        <div className="mb-6">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            label="Select Date"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : menus.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No menus found for this date</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div key={menu._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold capitalize">
                    {menu.mealType}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(menu)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(menu._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {menu.items.map((item, idx) => (
                    <div key={idx} className="border-b pb-2">
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMenu(null);
          }}
          title={editingMenu ? "Edit Menu" : "Create Menu"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Meal Type
              </label>
              <select
                value={formData.mealType}
                onChange={(e) =>
                  setFormData({ ...formData, mealType: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Menu Items</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-blue-600 text-sm"
                >
                  + Add Item
                </button>
              </div>
              {formData.items.map((item, index) => (
                <div key={index} className="border p-3 rounded mb-2">
                  <Input
                    label="Item Name"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    label="Description (optional)"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 text-sm mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMenu(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingMenu ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ModernLayout>
  );
};

export default MenuManage;

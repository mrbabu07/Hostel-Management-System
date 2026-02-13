import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { menuService } from "../../services/menu.service";
import { toISODate } from "../../utils/formatDate";
import Loader from "../../components/common/Loader";

const MenuView = () => {
  const [menus, setMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, [selectedDate]);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await menuService.getMenus(selectedDate);
      setMenus(response.data.menus);
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: "🌅",
      lunch: "🌞",
      dinner: "🌙",
    };
    return icons[mealType] || "🍽️";
  };

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Menu</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : menus.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No menu available for this date</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div key={menu._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">{getMealIcon(menu.mealType)}</span>
                  <h2 className="text-xl font-semibold capitalize">
                    {menu.mealType}
                  </h2>
                </div>
                <div className="space-y-2">
                  {menu.items.map((item, index) => (
                    <div key={index} className="border-b pb-2">
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
      </div>
    </AppLayout>
  );
};

export default MenuView;

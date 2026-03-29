import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { settingsService } from "../../services/settings.service";
import {
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ClockIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    breakfastPrice: 30,
    lunchPrice: 50,
    dinnerPrice: 40,
    cutoffTime: "20:00",
    cutoffDaysBefore: 1,
    extraCharges: 0,
    discountPercentage: 0,
    taxPercentage: 0,
    messName: "Hostel Mess",
    messAddress: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: "", reason: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSettings();
      if (response.data) {
        setFormData(response.data);
        setHolidays(response.data.holidays || []);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await settingsService.updateSettings(formData);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to save settings");
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddHoliday = async () => {
    if (newHoliday.date && newHoliday.reason) {
      try {
        await settingsService.addHoliday(newHoliday);
        await fetchSettings();
        setNewHoliday({ date: "", reason: "" });
      } catch (error) {
        console.error("Error adding holiday:", error);
        alert("Failed to add holiday");
      }
    }
  };

  const handleRemoveHoliday = async (id) => {
    if (!confirm("Are you sure you want to remove this holiday?")) return;
    try {
      await settingsService.removeHoliday(id);
      await fetchSettings();
    } catch (error) {
      console.error("Error removing holiday:", error);
      alert("Failed to remove holiday");
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
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 mb-6 text-white shadow-premium-lg animate-gradient"
          style={{ backgroundSize: '200% 200%' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Cog6ToothIcon className="w-10 h-10" />
                <h1 className="text-4xl font-bold">System Settings</h1>
              </div>
              <p className="text-white/90 text-lg">
                Configure system-wide settings and preferences
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white/90 backdrop-blur-lg text-violet-600 px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 hover:bg-white"
            >
              <CheckCircleIcon className="w-5 h-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl backdrop-blur-lg shadow-lg ${
              message.includes("success")
                ? "bg-green-50/80 text-green-700 border-2 border-green-200/50"
                : "bg-red-50/80 text-red-700 border-2 border-red-200/50"
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">Meal Pricing</h2>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Set prices for each meal</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Breakfast Price (₹)
                </label>
                <input
                  type="number"
                  name="breakfastPrice"
                  value={formData.breakfastPrice}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Lunch Price (₹)
                </label>
                <input
                  type="number"
                  name="lunchPrice"
                  value={formData.lunchPrice}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Dinner Price (₹)
                </label>
                <input
                  type="number"
                  name="dinnerPrice"
                  value={formData.dinnerPrice}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">Meal Confirmation</h2>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Configure cutoff time</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Cutoff Time
                </label>
                <input
                  type="time"
                  name="cutoffTime"
                  value={formData.cutoffTime}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Days Before
                </label>
                <input
                  type="number"
                  name="cutoffDaysBefore"
                  value={formData.cutoffDaysBefore}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="bg-blue-50/80 dark:bg-blue-500/20 backdrop-blur-lg p-4 rounded-xl border border-blue-200/50 dark:border-blue-500/30">
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                  Students must confirm meals {formData.cutoffDaysBefore} day(s) before by {formData.cutoffTime}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">Billing Settings</h2>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Extra charges and discounts</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Extra Charges (₹)
                </label>
                <input
                  type="number"
                  name="extraCharges"
                  value={formData.extraCharges}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Tax (%)
                </label>
                <input
                  type="number"
                  name="taxPercentage"
                  value={formData.taxPercentage}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <InformationCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">Mess Information</h2>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Basic information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Mess Name
                </label>
                <input
                  type="text"
                  name="messName"
                  value={formData.messName}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Address
                </label>
                <textarea
                  name="messAddress"
                  value={formData.messAddress}
                  onChange={handleChange}
                  rows="2"
                  className="input resize-none"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mt-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-rose-500 to-red-600 p-3 rounded-xl shadow-lg">
              <CalendarDaysIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">Holidays</h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Manage no-meal days</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
              className="input"
            />
            <input
              type="text"
              value={newHoliday.reason}
              onChange={(e) => setNewHoliday({ ...newHoliday, reason: e.target.value })}
              placeholder="Reason (e.g., National Holiday)"
              className="input"
            />
            <button
              onClick={handleAddHoliday}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Holiday
            </button>
          </div>

          {holidays.length > 0 ? (
            <div className="space-y-3">
              {holidays.map((holiday) => (
                <div
                  key={holiday._id}
                  className="flex justify-between items-center p-4 bg-white/60 dark:bg-secondary-700/60 backdrop-blur-lg rounded-xl hover:shadow-lg transition-all duration-300 border border-secondary-200/50 dark:border-secondary-600/50"
                >
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">{holiday.reason}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {new Date(holiday.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveHoliday(holiday._id)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 p-2 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDaysIcon className="w-16 h-16 mx-auto text-secondary-300 dark:text-secondary-600 mb-4 animate-float" />
              <p className="text-secondary-500">No holidays configured yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </ModernLayout>
  );
};

export default Settings;

import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { billingService } from "../../services/billing.service";
import { getCurrentMonth, getCurrentYear } from "../../utils/formatDate";
import Button from "../../components/common/Button";

const BillingManage = () => {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchBills();
  }, [month, year]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billingService.getAllBills(month, year);
      const billsData = Array.isArray(response.data) ? response.data : [];
      setBills(billsData);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBills = async () => {
    if (!confirm(`Generate bills for ${month}/${year}?`)) return;
    try {
      setGenerating(true);
      await billingService.generateBills(month, year);
      alert("Bills generated successfully");
      fetchBills();
    } catch (error) {
      console.error("Error generating bills:", error);
      alert(error.message || "Failed to generate bills");
    } finally {
      setGenerating(false);
    }
  };

  const calculateTotals = () => {
    const total = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const paid = bills.filter((b) => b.isPaid).length;
    const unpaid = bills.length - paid;
    return { total, paid, unpaid };
  };

  const totals = calculateTotals();

  return (
    <AppLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Billing Management</h1>
          <Button onClick={handleGenerateBills} disabled={generating}>
            {generating ? "Generating..." : "Generate Bills"}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    {new Date(2024, m - 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">
                ₹{totals.total.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Paid Bills</p>
              <p className="text-2xl font-bold text-green-600">{totals.paid}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Unpaid Bills</p>
              <p className="text-2xl font-bold text-red-600">{totals.unpaid}</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : bills.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No bills found for this period
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Roll Number</th>
                    <th className="px-4 py-3 text-left">Breakfast</th>
                    <th className="px-4 py-3 text-left">Lunch</th>
                    <th className="px-4 py-3 text-left">Dinner</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {bill.userId?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {bill.userId?.rollNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3">₹{bill.breakfastAmount}</td>
                      <td className="px-4 py-3">₹{bill.lunchAmount}</td>
                      <td className="px-4 py-3">₹{bill.dinnerAmount}</td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{bill.totalAmount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            bill.isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {bill.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default BillingManage;

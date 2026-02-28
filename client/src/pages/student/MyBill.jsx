import { useEffect, useState } from "react";
import ModernLayout from "../../components/layout/ModernLayout";
import { billingService } from "../../services/billing.service";
import { getCurrentMonth, getCurrentYear } from "../../utils/formatDate";

const MyBill = () => {
  const [bill, setBill] = useState(null);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBill();
  }, [month, year]);

  const fetchBill = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await billingService.getMyBill(month, year);
      setBill(response.data.bill);
    } catch (error) {
      setError("No bill found for this month");
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">My Bill</h1>

        <div className="mb-6 flex gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {bill && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Bill Details</h2>

            <div className="space-y-4 mb-6">
              {Object.entries(bill.breakdown).map(([mealType, data]) => (
                <div
                  key={mealType}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium capitalize">{mealType}</p>
                    <p className="text-sm text-gray-600">
                      {data.count} meals × ₹{data.rate}
                    </p>
                  </div>
                  <p className="font-semibold">₹{data.total}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{bill.totalAmount}</span>
              </div>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded text-sm ${bill.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {bill.status === "paid" ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
};

export default MyBill;

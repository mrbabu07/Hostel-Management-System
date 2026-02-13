import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { feedbackService } from "../../services/feedback.service";
import { toISODate } from "../../utils/formatDate";
import Button from "../../components/common/Button";
import { Star } from "lucide-react";

const Feedback = () => {
  const [formData, setFormData] = useState({
    date: toISODate(new Date()),
    mealType: "breakfast",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setMessage("Please select a rating");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await feedbackService.submitFeedback(formData);
      setMessage("Feedback submitted successfully!");
      setFormData({ ...formData, rating: 0, comment: "" });
    } catch (error) {
      setMessage("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Give Feedback</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="px-4 py-2 border rounded-lg w-full"
                max={toISODate(new Date())}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Meal Type
              </label>
              <select
                value={formData.mealType}
                onChange={(e) =>
                  setFormData({ ...formData, mealType: e.target.value })
                }
                className="px-4 py-2 border rounded-lg w-full"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 ${star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {message}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Feedback;

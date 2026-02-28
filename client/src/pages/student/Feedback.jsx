import { useState } from "react";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { feedbackService } from "../../services/feedback.service";
import { toISODate } from "../../utils/formatDate";
import { Star, MessageSquare, Send } from "lucide-react";

const Feedback = () => {
  const [formData, setFormData] = useState({
    date: toISODate(new Date()),
    mealType: "breakfast",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

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
      setFormData({ 
        date: toISODate(new Date()),
        mealType: "breakfast",
        rating: 0, 
        comment: "" 
      });
    } catch (error) {
      setMessage("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 mb-6 text-white shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Give Feedback</h1>
          </div>
          <p className="text-white/90 text-lg">
            Share your dining experience and help us improve
          </p>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                max={toISODate(new Date())}
              />
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meal Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => setFormData({ ...formData, mealType: meal })}
                    className={`py-3 px-4 rounded-xl font-medium capitalize transition-all ${
                      formData.mealType === meal
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rating
              </label>
              <div className="flex gap-3 justify-center py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="focus:outline-none transform transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 transition-all ${
                        star <= (hoveredStar || formData.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {formData.rating === 5 && "Excellent! 🌟"}
                  {formData.rating === 4 && "Very Good! 😊"}
                  {formData.rating === 3 && "Good 👍"}
                  {formData.rating === 2 && "Could be better 😐"}
                  {formData.rating === 1 && "Needs improvement 😞"}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all resize-none"
                rows="4"
                placeholder="Share your experience, suggestions, or concerns..."
              />
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl ${
                  message.includes("success")
                    ? "bg-green-50 text-green-700 border-2 border-green-200"
                    : "bg-red-50 text-red-700 border-2 border-red-200"
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </ModernLayout>
  );
};

export default Feedback;

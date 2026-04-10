import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { feedbackService } from "../../services/feedback.service";
import { toISODate } from "../../utils/formatDate";
import { Star, TrendingUp, MessageCircle, BarChart3, Calendar } from "lucide-react";

const FeedbackSummary = () => {
  const [startDate, setStartDate] = useState(
    toISODate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
  );
  const [endDate, setEndDate] = useState(toISODate(new Date()));
  const [mealType, setMealType] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, [startDate, endDate, mealType]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await feedbackService.getFeedbackSummary(
        startDate,
        endDate,
        mealType,
      );
      setSummary(response.data || null);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
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
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Feedback Summary</h1>
          </div>
          <p className="text-white/90 text-lg">
            Analyze student feedback and improve meal quality
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              >
                <option value="">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !summary ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No feedback data available</p>
          </motion.div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100">Total Feedback</p>
                  <MessageCircle className="w-8 h-8 text-blue-200" />
                </div>
                <p className="text-4xl font-bold">{summary.totalFeedback || 0}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-yellow-100">Average Rating</p>
                  <Star className="w-8 h-8 text-yellow-200 fill-yellow-200" />
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-bold">
                    {summary.averageRating?.toFixed(1) || 0}
                  </p>
                  {renderStars(Math.round(summary.averageRating || 0))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-green-100">Positive Feedback</p>
                  <TrendingUp className="w-8 h-8 text-green-200" />
                </div>
                <p className="text-4xl font-bold">
                  {(summary.ratingDistribution?.[5] || 0) +
                    (summary.ratingDistribution?.[4] || 0)}
                </p>
              </motion.div>
            </div>

            {/* Rating Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Rating Distribution
              </h3>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = summary.ratingDistribution?.[rating] || 0;
                  const percentage =
                    summary.totalFeedback > 0
                      ? (count / summary.totalFeedback) * 100
                      : 0;
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-24">
                        <span className="text-sm font-semibold text-gray-700">
                          {rating}
                        </span>
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.4 + rating * 0.05, duration: 0.5 }}
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-6 rounded-full flex items-center justify-end pr-2"
                        >
                          {percentage > 10 && (
                            <span className="text-xs font-semibold text-white">
                              {percentage.toFixed(0)}%
                            </span>
                          )}
                        </motion.div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-20 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Comments */}
            {summary.recentFeedback && summary.recentFeedback.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Recent Comments
                </h3>
                <div className="space-y-4">
                  {summary.recentFeedback.map((feedback, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + index * 0.05 }}
                      className="border-2 border-gray-100 rounded-xl p-4 hover:border-violet-200 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {renderStars(feedback.rating)}
                          <span className="text-sm font-medium text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full">
                            {feedback.menuId?.mealType || "N/A"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {feedback.comment && (
                        <p className="text-gray-700 leading-relaxed">
                          {feedback.comment}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </ModernLayout>
  );
};

export default FeedbackSummary;

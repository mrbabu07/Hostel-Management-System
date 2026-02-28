import { useState, useEffect } from "react";
import ModernLayout from "../../components/layout/ModernLayout";
import { feedbackService } from "../../services/feedback.service";
import { toISODate } from "../../utils/formatDate";
import Input from "../../components/common/Input";
import { Star } from "lucide-react";

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
        <h1 className="text-3xl font-bold mb-6">Feedback Summary</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium mb-2">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : !summary ? (
            <div className="text-center py-8 text-gray-600">
              No feedback data available
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold">
                    {summary.totalFeedback || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-2xl font-bold">
                      {summary.averageRating?.toFixed(1) || 0}
                    </p>
                    {renderStars(Math.round(summary.averageRating || 0))}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Positive Feedback</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary.ratingDistribution?.[5] +
                      summary.ratingDistribution?.[4] || 0}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Rating Distribution
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = summary.ratingDistribution?.[rating] || 0;
                    const percentage =
                      summary.totalFeedback > 0
                        ? (count / summary.totalFeedback) * 100
                        : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-20">
                          <span className="text-sm font-medium">{rating}</span>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-yellow-400 h-4 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-16 text-right">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {summary.recentFeedback && summary.recentFeedback.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Recent Comments
                  </h3>
                  <div className="space-y-3">
                    {summary.recentFeedback.map((feedback, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {renderStars(feedback.rating)}
                            <span className="text-sm text-gray-600 capitalize">
                              {feedback.menuId?.mealType}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {feedback.comment && (
                          <p className="text-gray-700">{feedback.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ModernLayout>
  );
};

export default FeedbackSummary;

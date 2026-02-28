const BIGOVEN_API_KEY = import.meta.env.VITE_BIGOVEN_API_KEY;
const BIGOVEN_BASE_URL = "https://api2.bigoven.com";

// Fallback images from Unsplash
const FALLBACK_IMAGES = {
  rice: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80",
  curry: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  roti: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
  dal: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
  chicken: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&q=80",
  fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  vegetable: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
  lunch: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  dinner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
  default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
};

export const imageService = {
  /**
   * Fetch meal image from BigOven API
   * @param {string} mealName - Name of the meal
   * @returns {Promise<string>} - Image URL
   */
  async fetchMealImage(mealName) {
    try {
      if (!BIGOVEN_API_KEY) {
        console.warn("BigOven API key not configured");
        return this.getFallbackImage(mealName);
      }

      const response = await fetch(
        `${BIGOVEN_BASE_URL}/recipes?pg=1&rpp=1&title_kw=${encodeURIComponent(mealName)}&api_key=${BIGOVEN_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch from BigOven API");
      }

      const data = await response.json();

      if (data.Results && data.Results.length > 0 && data.Results[0].ImageURL) {
        return data.Results[0].ImageURL;
      }

      return this.getFallbackImage(mealName);
    } catch (error) {
      console.error("Error fetching meal image:", error);
      return this.getFallbackImage(mealName);
    }
  },

  /**
   * Get fallback image based on meal name
   * @param {string} mealName - Name of the meal
   * @returns {string} - Fallback image URL
   */
  getFallbackImage(mealName) {
    const lowerMeal = mealName.toLowerCase();

    for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
      if (lowerMeal.includes(key)) {
        return url;
      }
    }

    return FALLBACK_IMAGES.default;
  },

  /**
   * Batch fetch images for multiple meals
   * @param {Array<{id: string, name: string}>} meals - Array of meals
   * @returns {Promise<Object>} - Object mapping meal IDs to image URLs
   */
  async fetchMealImages(meals) {
    const imagePromises = meals.map(async (meal) => {
      const imageUrl = await this.fetchMealImage(meal.name);
      return { id: meal.id, imageUrl };
    });

    const results = await Promise.all(imagePromises);
    
    return results.reduce((acc, { id, imageUrl }) => {
      acc[id] = imageUrl;
      return acc;
    }, {});
  },
};

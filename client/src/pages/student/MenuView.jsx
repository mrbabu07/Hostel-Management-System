import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CardMedia,
  Skeleton,
} from "@mui/material";
import {
  Restaurant,
  WbSunny,
  Brightness3,
  LunchDining,
  ImageNotSupported,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import ModernLoader from "../../components/common/ModernLoader";
import EmptyState from "../../components/common/EmptyState";
import { menuService } from "../../services/menu.service";
import { toISODate } from "../../utils/formatDate";

const MenuView = () => {
  const [menus, setMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [loading, setLoading] = useState(false);
  const [mealImages, setMealImages] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    fetchMenus();
  }, [selectedDate]);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await menuService.getMenus(selectedDate);
      const menusData = response.data.menus;
      setMenus(menusData);
      
      // Fetch images for each meal
      menusData.forEach((menu) => {
        if (menu.items && menu.items.length > 0) {
          fetchMealImage(menu._id, menu.items[0].name || menu.items[0]);
        }
      });
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMealImage = async (menuId, mealName) => {
    setImageLoading((prev) => ({ ...prev, [menuId]: true }));
    try {
      const apiKey = import.meta.env.VITE_BIGOVEN_API_KEY;
      const response = await fetch(
        `https://api2.bigoven.com/recipes?pg=1&rpp=1&title_kw=${encodeURIComponent(mealName)}&api_key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.Results && data.Results.length > 0 && data.Results[0].ImageURL) {
        setMealImages((prev) => ({
          ...prev,
          [menuId]: data.Results[0].ImageURL,
        }));
      } else {
        // Fallback to generic meal images
        setMealImages((prev) => ({
          ...prev,
          [menuId]: getDefaultMealImage(mealName),
        }));
      }
    } catch (error) {
      console.error("Error fetching meal image:", error);
      setMealImages((prev) => ({
        ...prev,
        [menuId]: getDefaultMealImage(mealName),
      }));
    } finally {
      setImageLoading((prev) => ({ ...prev, [menuId]: false }));
    }
  };

  const getDefaultMealImage = (mealName) => {
    // Fallback images from Unsplash
    const defaultImages = {
      rice: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400",
      curry: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
      bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
      breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400",
      lunch: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      dinner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    };
    
    const lowerMeal = mealName.toLowerCase();
    for (const [key, url] of Object.entries(defaultImages)) {
      if (lowerMeal.includes(key)) return url;
    }
    return defaultImages.lunch;
  };

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: WbSunny,
      lunch: LunchDining,
      dinner: Brightness3,
    };
    return icons[mealType] || Restaurant;
  };

  const getMealColor = (mealType) => {
    const colors = {
      breakfast: "#F59E0B",
      lunch: "#10B981",
      dinner: "#8b9cff",
    };
    return colors[mealType] || "#667eea";
  };

  return (
    <ModernLayout>
      <Box>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Today's Menu 🍽️
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Check what's cooking for you today
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Date Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <TextField
                type="date"
                label="Select Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Cards */}
        {loading ? (
          <ModernLoader />
        ) : menus.length === 0 ? (
          <EmptyState
            icon={Restaurant}
            title="No Menu Available"
            description="No menu has been set for this date yet"
          />
        ) : (
          <Grid container spacing={3}>
            {menus.map((menu, index) => {
              const MealIcon = getMealIcon(menu.mealType);
              const mealColor = getMealColor(menu.mealType);

              return (
                <Grid item xs={12} md={4} key={menu._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      {/* Meal Image */}
                      {imageLoading[menu._id] ? (
                        <Skeleton variant="rectangular" height={200} />
                      ) : mealImages[menu._id] ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={mealImages[menu._id]}
                          alt={menu.mealType}
                          sx={{
                            objectFit: "cover",
                            filter: "brightness(0.9)",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 200,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: `${mealColor}20`,
                          }}
                        >
                          <ImageNotSupported
                            sx={{ fontSize: 60, color: mealColor, opacity: 0.5 }}
                          />
                        </Box>
                      )}
                      
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 3,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              backgroundColor: `${mealColor}20`,
                              color: mealColor,
                            }}
                          >
                            <MealIcon sx={{ fontSize: 32 }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              sx={{ textTransform: "capitalize" }}
                            >
                              {menu.mealType}
                            </Typography>
                            <Chip
                              label={`${menu.items?.length || 0} items`}
                              size="small"
                              sx={{
                                backgroundColor: `${mealColor}20`,
                                color: mealColor,
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </Box>

                        <List>
                          {menu.items?.map((item, idx) => (
                            <ListItem
                              key={idx}
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                backgroundColor: "action.hover",
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography variant="body1" fontWeight={500}>
                                    {item.name || item}
                                  </Typography>
                                }
                                secondary={item.description}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </ModernLayout>
  );
};

export default MenuView;

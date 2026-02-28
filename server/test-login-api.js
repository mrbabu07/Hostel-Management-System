const axios = require("axios");

const testLogin = async () => {
  try {
    console.log("🧪 Testing login API...\n");

    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/login",
      {
        email: "admin@hostel.com",
        password: "Admin@123",
      },
    );

    console.log("✅ Login successful!");
    console.log("📦 Response status:", response.status);
    console.log("📦 Response data:", JSON.stringify(response.data, null, 2));

    if (response.data.data) {
      console.log(
        "\n🔑 Token:",
        response.data.data.token ? "Present" : "Missing",
      );
      console.log("👤 User:", response.data.data.user ? "Present" : "Missing");

      if (response.data.data.user) {
        console.log("   - Name:", response.data.data.user.name);
        console.log("   - Email:", response.data.data.user.email);
        console.log("   - Role:", response.data.data.user.role);
        console.log(
          "   - ID:",
          response.data.data.user._id || response.data.data.user.id,
        );
      }
    }
  } catch (error) {
    console.error("❌ Login failed!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is the server running?");
      console.error("Make sure to run: cd server && npm run dev");
    } else {
      console.error("Error:", error.message);
    }
  }
};

testLogin();

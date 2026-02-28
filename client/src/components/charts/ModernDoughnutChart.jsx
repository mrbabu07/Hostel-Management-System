import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

ChartJS.register(ArcElement, Tooltip, Legend);

const ModernDoughnutChart = ({ title, data, labels }) => {
  const theme = useTheme();

  const colors = [
    "#667eea",
    "#764ba2",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#3B82F6",
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderColor: theme.palette.background.paper,
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: theme.palette.text.primary,
          padding: 15,
          font: {
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === "dark" ? "#1E293B" : "#ffffff",
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%",
  };

  // Calculate total for center text
  const total = data.reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300, mt: 2, position: "relative" }}>
          <Doughnut data={chartData} options={options} />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "25%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight={700} color="primary">
              {total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ModernDoughnutChart;

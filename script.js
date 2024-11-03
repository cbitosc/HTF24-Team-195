// Retrieve stored step goal from localStorage (if it exists)
const storedStepGoal = localStorage.getItem("stepGoal");
const initialStepGoal = storedStepGoal ? parseInt(storedStepGoal) : 10000; // Default step goal

const pieChartData = {
  labels: ["Steps Taken", "Steps Remaining"],
  datasets: [
    {
      data: [0, initialStepGoal], // Start with 0 steps taken
      backgroundColor: ["#4caf50", "white"], // Green for steps taken, white for remaining
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
};

const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        color: "#fff",
      },
    },
    tooltip: {
      bodyColor: "#fff",
      titleColor: "#fff",
    },
  },
};

// Initialize the pie chart
const pieChart = new Chart(document.getElementById("stepsPieChart"), {
  type: "doughnut",
  data: pieChartData,
  options: pieChartOptions,
});

// Bar chart data and options for steps tracker
const barChartData = {
  labels: [], // To store dates
  datasets: [
    {
      label: "Steps Taken",
      data: [], // To store steps taken for each day
      backgroundColor: "#4caf50", // Green
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
};

// Initialize the bar chart for steps
const barChart = new Chart(document.getElementById("stepsBarChart"), {
  type: "bar",
  data: barChartData,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff",
        },
      },
      tooltip: {
        bodyColor: "#fff",
        titleColor: "#fff",
      },
    },
  },
});

// Bar chart data and options for calories tracker
const caloriesChartData = {
  labels: [], // To store dates
  datasets: [
    {
      label: "Calories Burned",
      data: [], // To store calories for each day
      backgroundColor: "#ff5722", // Orange
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
};

// Initialize the bar chart for calories
const caloriesChart = new Chart(document.getElementById("caloriesBarChart"), {
  type: "bar",
  data: caloriesChartData,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff",
        },
      },
      tooltip: {
        bodyColor: "#fff",
        titleColor: "#fff",
      },
    },
  },
});

// Load previously stored data from local storage
const loadStoredData = () => {
  const storedData = JSON.parse(localStorage.getItem("dailyData")) || [];
  storedData.forEach(({ date, steps, calories }) => {
    barChartData.labels.push(date);
    barChartData.datasets[0].data.push(steps);
    caloriesChartData.labels.push(date);
    caloriesChartData.datasets[0].data.push(calories);
  });
  barChart.update();
  caloriesChart.update();
};

// Function to update the charts based on user input
function updateStepsChart() {
  const stepGoal = parseInt(document.getElementById("stepGoal").value);
  const stepsTaken = parseInt(document.getElementById("stepsTaken").value);

  if (isNaN(stepGoal) || isNaN(stepsTaken)) {
    alert("Please enter valid numbers for step goal and steps taken.");
    return;
  }

  // Store the step goal in localStorage
  localStorage.setItem("stepGoal", stepGoal);

  const stepsRemaining = Math.max(stepGoal - stepsTaken, 0);
  const caloriesBurned = (stepsTaken * 0.04).toFixed(2); // Calculate calories burned

  // Update pie chart data
  pieChartData.datasets[0].data = [stepsTaken, stepsRemaining];
  pieChart.update();

  // Update daily data in local storage
  const currentDate = new Date().toLocaleDateString();
  let dailyData = JSON.parse(localStorage.getItem("dailyData")) || [];

  // Check if there's an entry for today
  const existingEntryIndex = dailyData.findIndex(
    (entry) => entry.date === currentDate
  );

  if (existingEntryIndex === -1) {
    // If no entry exists for today, add it
    dailyData.push({
      date: currentDate,
      steps: stepsTaken,
      calories: parseFloat(caloriesBurned),
    });
  } else {
    // If an entry exists, update it
    dailyData[existingEntryIndex].steps += stepsTaken; // Increment steps taken
    dailyData[existingEntryIndex].calories += parseFloat(caloriesBurned); // Increment calories burned
  }

  // Save updated daily data to local storage
  localStorage.setItem("dailyData", JSON.stringify(dailyData));

  // Update the bar charts
  updateBarChart(stepsTaken);
  updateCaloriesChart(caloriesBurned);
}

// Function to update the steps bar chart
function updateBarChart(stepsTaken) {
  const currentDate = new Date().toLocaleDateString(); // Get current date
  let index = barChartData.labels.indexOf(currentDate); // Check if the date already exists

  if (index === -1) {
    // If the date doesn't exist, add it
    barChartData.labels.push(currentDate);
    barChartData.datasets[0].data.push(stepsTaken);
  } else {
    // If the date exists, update the steps taken
    barChartData.datasets[0].data[index] += stepsTaken; // Add new steps to the existing ones
  }

  barChart.update(); // Update the bar chart
}

// Function to update the calories bar chart
function updateCaloriesChart(caloriesBurned) {
  const currentDate = new Date().toLocaleDateString(); // Get current date
  let index = caloriesChartData.labels.indexOf(currentDate); // Check if the date already exists

  if (index === -1) {
    // If the date doesn't exist, add it
    caloriesChartData.labels.push(currentDate);
    caloriesChartData.datasets[0].data.push(caloriesBurned); // Push calculated calories
  } else {
    // If the date exists, update the calories burned
    caloriesChartData.datasets[0].data[index] += parseFloat(caloriesBurned); // Add new calories to the existing ones
  }

  caloriesChart.update(); // Update the calories bar chart
}

// Populate the step goal input with the stored value when the page loads
document.addEventListener("DOMContentLoaded", () => {
  if (storedStepGoal) {
    document.getElementById("stepGoal").value = storedStepGoal;
  }
  loadStoredData(); // Load previously stored data
});

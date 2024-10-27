// IndexedDB setup
let db;
const request = indexedDB.open("StudentLoginDB", 1); // Database name

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore("students", {
    keyPath: "id",
    autoIncrement: true,
  });
  objectStore.createIndex("email", "email", { unique: true });
  objectStore.createIndex("password", "password", { unique: false });
};

request.onsuccess = (event) => {
  db = event.target.result;
};

request.onerror = (event) => {
  console.error("Database error: " + event.target.errorCode);
};

// Select elements
let signup = document.querySelector("#signup");
let login = document.querySelector("#login");
let title = document.querySelector("#title");
let nameField = document.querySelector("#name");
let emailField = document.querySelector(".input-field input[type='email']");
let passwordField = document.querySelector(
  ".input-field input[type='password']"
);

// Function to switch to login
login.onclick = () => {
  nameField.style.maxHeight = "0"; // Hide username field for login
  title.innerHTML = "Login"; // Change title to "Login"
  signup.classList.add("disable"); // Disable sign-up button
  login.classList.remove("disable"); // Enable login button
};

// Function to switch to sign-up
signup.onclick = () => {
  nameField.style.maxHeight = "65px"; // Show username field for sign-up
  title.innerHTML = "Sign Up"; // Change title to "Sign Up"
  signup.classList.remove("disable"); // Enable sign-up button
  login.classList.add("disable"); // Disable login button
};

// Sign up functionality
signup.addEventListener("click", () => {
  const username = nameField.querySelector("input").value.trim();
  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  // Log the inputs for debugging
  console.log(
    "Sign Up - Username:",
    username,
    ", Email:",
    email,
    ", Password:",
    password
  );

  // Check if inputs are filled
  if (username && email && password) {
    const transaction = db.transaction(["students"], "readwrite");
    const objectStore = transaction.objectStore("students");

    // Create a new student object
    const newStudent = {
      username: username, // Keep username for sign-up, but not for login
      email: email,
      password: password,
    };

    // Add student to the IndexedDB
    const request = objectStore.add(newStudent);

    request.onsuccess = () => {
      // Reset the form fields after sign-up
      nameField.querySelector("input").value = "";
      emailField.value = "";
      passwordField.value = "";

      alert("Sign up successful! You can now log in.");
    };

    request.onerror = (event) => {
      alert("Error adding student: " + event.target.error);
    };
  }
});

// Login functionality
login.addEventListener("click", () => {
  const enteredEmail = emailField.value.trim(); // Use email field for login
  const enteredPassword = passwordField.value.trim();

  // Log the inputs for debugging
  console.log("Login - Email:", enteredEmail, ", Password:", enteredPassword);

  // Check if inputs are filled
  if (enteredEmail && enteredPassword) {
    const transaction = db.transaction(["students"], "readonly");
    const objectStore = transaction.objectStore("students");

    // Find the student by email
    const request = objectStore.index("email").get(enteredEmail);

    request.onsuccess = (event) => {
      const student = event.target.result; // Retrieve the student object
      if (student && enteredPassword === student.password) {
        alert("Login successful!");
        // Redirect to students dashboard page after successful login
        window.location.href = "index.html";
      } else {
        alert("Invalid credentials. Please try again.");
      }
    };

    request.onerror = (event) => {
      alert("Error retrieving student: " + event.target.error);
    };
  }
});

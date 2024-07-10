import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/tradeSignUp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit process on connection failure
  });

// Define user schema
const userSchema = new mongoose.Schema({
  Name: String,
  Field: String,
  Location: String,
  Contact: String,
});

// Create User model
const User = mongoose.model("User", userSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "tools.html"));
});

// Handle POST requests to /signup
app.post("/signup", async (req, res) => {
  const { Name, Field, Location, Contact } = req.body;

  // Create a new user instance
  const user = new User({ Name, Field, Location, Contact });

  try {
    // Save the user to the database
    await user.save();
    console.log("User saved:", { Name, Field, Location, Contact });
    res.json({ message: "Sign up successful" });
  } catch (err) {
    console.error("Failed to save user", err);
    res.status(500).json({ message: "Sign up failed" });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).exec(); // Use .exec() to execute the query

    res.json(users); // Send users as JSON response
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

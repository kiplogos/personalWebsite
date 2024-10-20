import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

// Enable CORS for all origins (for development only)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

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

// Define labourers schema
const userSchema = new mongoose.Schema({
  Name: String,
  Field: String,
  Location: String,
  Contact: String,
});

// Create User model
const User = mongoose.model("User", userSchema);

//Create Supplier schema
const supplierSchema = new mongoose.Schema({
  Name: String,
  Field: String,
  Location: String,
  Contact: String,
});

// Create Supplier model
const Supplier = mongoose.model("Supplier", supplierSchema);

//Create Steel Data schema
const steelDataSchema = new mongoose.Schema({
  Section: String,
  Size: String,
  Thickness_mm: Number,
  Kgs_per_6mtr: Number,
  Factor: Number,
});

// Create SteelData model
const Steel_data = mongoose.model("SteelData", steelDataSchema);


// Get Steel Data
app.get("/steel_datas", async (req, res) => {
  try {
    const steel_datas = await Steel_data.find({}).exec(); // Use .exec() to execute the query

    res.json(steel_datas); // Send users as JSON response
    console.log(steel_datas)
  } catch (err) {
    console.error("Error fetching steel data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





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

// Handle POST requests to /signup-labour
app.post("/signup-labour", async (req, res) => {
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



// Handle POST requests to /signup-suppliers
app.post("/signup-suppliers", async (req, res) => {
  const { Name, Field, Location, Contact } = req.body;

  // Create a new user instance
  const supplier = new Supplier({ Name, Field, Location, Contact });

  try {
    // Save the user to the database
    await supplier.save();
    console.log("Supplier saved:", { Name, Field, Location, Contact });
    res.json({ message: "Supplier sign up successful!" });
  } catch (err) {
    console.error("Failed to save supplier", err);
    res.status(500).json({ message: "Sign up failed" });
  }
});

//Get Suppliers
app.get("/suppliers", async (req, res) => {
  try {
    const location = req.query.location;
    console.log("Location received:", location);
    const query = location ? { Location: location } : {};
    const suppliers = await Supplier.find(query).exec();

    res.json(suppliers); // Send suppliers as JSON response
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




//Get labourers
app.get("/users", async (req, res) => {
  try {
    const location = req.query.location;
    console.log("Location received:", location);
    
    const query = location ? { Location: location } : {};

    const users = await User.find(query).exec(); // Use .exec() to execute the query
    console.log("Users found:", users);

    res.json(users); // Send users as JSON response
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// //Get labourers
// app.get("/users", async (req, res) => {
//   try {
//     const location = req.query.location;
    
//     const query = location ? { Location: location } : {};
//     const users = await User.find({query}).exec(); // Use .exec() to execute the query

//     res.json(users); // Send users as JSON response
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

// Enable CORS for all origins (for development only)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware to parse JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/jobsDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    nod;
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Define schemas and models
const visitorSchema = new mongoose.Schema({
  Name: String,
  Email: { type: String, required: true, unique: true },
  Password: String,
  repeatedPassword: String,
});
const Visitor = mongoose.model("Visitor", visitorSchema);

const userSchema = new mongoose.Schema({
  Name: String,
  Field: String,
  Location: String,
  Contact: {
    type: String,
    unique: true,
    required: true,
  },
});
const User = mongoose.model("User", userSchema);

const supplierSchema = new mongoose.Schema({
  Name: String,
  Field: String,
  Location: String,
  Contact: {
    type: String,
    unique: true,
    required: true,
  },
  Email: { type: String, required: true, unique: true },
});
const Supplier = mongoose.model("Supplier", supplierSchema);

const steelDataSchema = new mongoose.Schema({
  Section: String,
  Size: String,
  Thickness_mm: Number,
  Kgs_per_6mtr: Number,
  Factor: Number,
});
const SteelData = mongoose.model("SteelData", steelDataSchema);

const jobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    Name: String,
    Contact: String,
    Email: { type: String, required: true },
    Location: String,
    Trade: String,
    Description: String,
  },
  { timestamps: true }
);
const Job = mongoose.model("Job", jobSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "tools.html"));
});

app.get("/job-board", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "job-board.html"));
});

// Steel Data
app.get("/steel_datas", async (req, res) => {
  try {
    const steelDatas = await SteelData.find({}).exec();
    res.json(steelDatas);
  } catch (err) {
    console.error("Error fetching steel data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Sign up Labour
app.post("/signup-labour", async (req, res) => {
  const { Name, Field, Location, Contact } = req.body;

  try {
    // Check for duplicate Contact
    const existingUser = await User.findOne({ Contact });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A labourer with this contact already exists." });
    }

    const user = new User({ Name, Field, Location, Contact });
    await user.save();
    res.json({ message: "Sign up successful!" });
  } catch (err) {
    // Handle unique constraint violations
    if (err.code === 11000 && err.keyPattern?.Contact) {
      return res
        .status(400)
        .json({ message: "A labourer with this contact already exists." });
    }

    console.error("Failed to save labourer:", err);
    res.status(500).json({ message: "Sign up failed." });
  }
});

// Sign up Visitor
app.post(
  "/signup-visitors",
  [
    check("Email").isEmail().withMessage("Invalid email format"),
    check("Password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const { Name, Email, Password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check for duplicate Email
      const existingVisitor = await Visitor.findOne({ Email });
      if (existingVisitor) {
        return res
          .status(400)
          .json({ message: "A visitor with this email already exists." });
      }

      const hashedPassword = await bcrypt.hash(Password, 10);
      const visitor = new Visitor({ Name, Email, Password: hashedPassword });
      await visitor.save();

      res.json({ message: "Visitor sign up successful!" });
    } catch (err) {
      // Handle unique constraint violations
      if (err.code === 11000 && err.keyPattern?.Email) {
        return res
          .status(400)
          .json({ message: "A visitor with this email already exists." });
      }

      console.error("Failed to save visitor:", err);
      res.status(500).json({ message: "Sign up failed." });
    }
  }
);

// Sign up Supplier
app.post("/signup-suppliers", async (req, res) => {
  const { Name, Field, Location, Contact, Email } = req.body;

  try {
    // Check for duplicate Contact or Email
    const existingSupplier = await Supplier.findOne({
      $or: [{ Contact }, { Email }],
    });
    if (existingSupplier) {
      return res.status(400).json({
        message: "A supplier with this contact or email already exists.",
      });
    }

    const supplier = new Supplier({ Name, Field, Location, Contact, Email });
    await supplier.save();

    res.json({ message: "Supplier sign up successful!" });
  } catch (err) {
    console.error("Failed to save supplier:", err);
    res.status(500).json({ message: "Sign up failed." });
  }
});

// Get Suppliers
app.get("/suppliers", async (req, res) => {
  try {
    const location = req.query.location;
    const query = location ? { Location: location } : {};
    const suppliers = await Supplier.find(query).select("-_id -__v").exec();
    res.json(suppliers);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Get labourers
app.get("/users", async (req, res) => {
  try {
    const location = req.query.location;
    console.log("Location received:", location);

    const query = location ? { Location: location } : {};

    const users = await User.find(query).select("-_id -__v").exec();
    console.log("Users found:", users);

    res.json(users); // Send users as JSON response
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Create Job
app.post("/create-job", async (req, res) => {
  const { userId, Name, Contact, Email, Location, Trade, Description } =
    req.body;

  try {
    // Create new job linked to the user
    const newJob = new Job({
      userId,
      Name,
      Contact,
      Email,
      Location,
      Trade,
      Description,
    });
    await newJob.save();

    res.status(201).json({ message: "Job created successfully.", newJob });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Failed to create job." });
  }
});



// Get Jobs
app.get("/jobs", async (req, res) => {
  try {
    const { page = 1, limit = 10, trade, location } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (trade && trade !== "Select Trade:") filter.Trade = trade;
    if (location && location !== "Filter by Location:")
      filter.Location = location;
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);
    res.json({ jobs, totalPages });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ message: "Failed to load jobs. Please try again later." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

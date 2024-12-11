import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "job-board.html"));
});

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
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit process on connection failure
  });

// Define Jobs schema
const jobSchema = new mongoose.Schema(
  {
    Name: String,
    Contact: String,
    Email: {
      type: String,
      required: true,
    },
    Location: String,
    Trade: String,
    Description: String,
  },
  { timestamps: true }
);

// Create Jobs model
const Job = mongoose.model("Job", jobSchema);

// Handle POST requests to /create-job
app.post("/create-job", async (req, res) => {
  const { Name, Contact, Email, Location, Trade, Description } = req.body;

  try {
    // Check if a job with the same email already exists
    const existingJob = await Job.findOne({ Email });

    if (existingJob) {
      return res.status(400).json({
        message: `Job with email ${Email} already exists.`,
      });
    }

    // Create a new job instance
    const job = new Job({ Name, Contact, Email, Location, Trade, Description });
    console.log(job);

    // Save the job to the database
    await job.save();
    console.log("Job saved:", {
      Name,
      Contact,
      Email,
      Location,
      Trade,
      Description,
    });
    res.json({ message: "Job created successfully!" });
  } catch (err) {
    console.error("Failed to create job!", err);
    res.status(500).json({ message: "Job creation failed!" });
  }
});

//Get Jobs from database
app.get("/jobs", async (req, res) => {
  try {
    const { page = 1, limit = 10, trade, location } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (trade && trade !== "Select Trade:") filter.Trade = trade;
    if (location && location !== "Filter by Location:")
      filter.Location = location;

    // Fetch jobs sorted by createdAt in descending order
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 }) // Sort by createdAt (newest first)
      .skip(skip)
      .limit(parseInt(limit));

    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);

    res.json({
      jobs,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ message: "Failed to load jobs. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

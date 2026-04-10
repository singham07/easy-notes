const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const noteRoutes = require("./routes/noteRoutes");

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cors());
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
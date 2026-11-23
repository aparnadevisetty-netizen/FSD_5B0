import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;
const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

connectDB(mongoURI, dbName);
app.use(express.json());

// Routes for todo API
app.use("/api/v1/todos", todoRoutes);
app.use("/api/todos", todoRoutes);
// Routes for user API
app.use("/api/v1/users", userRoutes);
app.use("/api/users", userRoutes);

// Public sample todos
app.get("/api/todos-json", (req, res) => {
  res.status(200).json({
    count: 2,
    todos: [
      { _id: "1", title: "Complete FSD Lab Deployments", completed: true },
      { _id: "2", title: "Verify Render and Vercel APIs", completed: true }
    ]
  });
});

//Test route
app.get("/", (req, res) => {
  res.json({
    message: "MVC Auth Todo API is running",
    endpoints: ["/api/v1/users", "/api/v1/todos", "/api/todos-json"]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

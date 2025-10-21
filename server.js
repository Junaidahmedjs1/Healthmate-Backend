require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://healthmate-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy does not allow access from the origin ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests globally
app.options("*", cors());

// ✅ Body parser
app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/files", require("./src/routes/files"));
app.use("/api/ai", require("./src/routes/ai"));

// ✅ Root check route
app.get("/", (req, res) =>
  res.send({ ok: true, message: "✅ HealthMate backend running on Railway" })
);

// ✅ Start server
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

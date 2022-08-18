const { Swaggiffy } = require("swaggiffy");
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// import routes
const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes");

//Error Handler middleware
const ErrorHandler = require("./middleware/error");

dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
app.use(multer({ storage }).single("image"));

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postsRoutes);

app.use(ErrorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

new Swaggiffy().setupExpress(app).swaggiffy();

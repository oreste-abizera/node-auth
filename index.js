const { Swaggiffy } = require("swaggiffy");
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");

// import routes
const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes");

dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postsRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

new Swaggiffy().setupExpress(app).swaggiffy();

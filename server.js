import express from "express";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoute.js";
import artistRoute from "./routes/artistRoute.js";
import albumRoute from "./routes/albumRoute.js";
import trackRoute from "./routes/trackRoute.js";
import favouriteRoute from "./routes/favouriteRoute.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/artists", artistRoute);
app.use("/api/v1/albums", albumRoute);
app.use("/api/v1/tracks", trackRoute);
app.use("/api/v1/favorites", favouriteRoute);

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});

export default app;

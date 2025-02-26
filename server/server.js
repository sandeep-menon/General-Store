import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
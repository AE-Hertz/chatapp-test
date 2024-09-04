import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { GoogleGenerativeAI } from "@google/generative-ai";
import geminiRoutes from "./routes/gemini.js";
import authRoutes from "./routes/auth.js";

// configs
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Gemini config
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// routes
app.use("/gemini", geminiRoutes);
app.use("/auth", authRoutes)

// server setup
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`EX app listening on ${PORT}`);
});

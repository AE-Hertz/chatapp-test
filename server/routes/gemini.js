import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { genAI } from "../index.js";
import rateLimit from "express-rate-limit";

dotenv.config();
const router = express.Router();

router.post("/text", async (req, res) => {
    try {
        const { text, activeChatId } = req.body;
        console.log("text", text);
        console.log("activeChatId", activeChatId);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [
                        {
                            text: "You are a helpful assistant. Keep your responses short and concise, like in a chat conversation.",
                        },
                    ],
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: "Got it. I'll keep things brief and to the point.",
                        },
                    ],
                },
            ],
        });

        const result = await chat.sendMessage([{ text: text }]);
        const messageContent = result.response.text();

        const chatEngineResponse = await axios.post(
            `https://api.chatengine.io/chats/${activeChatId}/messages/`,
            { text: messageContent },
            {
                headers: {
                    "Project-ID": process.env.PROJECT_ID,
                    "User-Name": process.env.BOT_USER_NAME,
                    "User-Secret": process.env.BOT_USER_SECRET,
                },
            }
        );

        res.status(200).json({
            text: messageContent,
        });
    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
        });
        res.status(500).json({
            error: "An error occurred while processing your request.",
            details: error.response?.data || error.message,
        });
    }
});

// CODE GEN

router.post("/code", async (req, res) => {
    try {
        const { text, activeChatId } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [
                        {
                            text: "You are a helpful assistant. Keep your responses short and concise, like in a chat conversation.",
                        },
                    ],
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: "Got it. I'll keep things brief and to the point.",
                        },
                    ],
                },
            ],
        });

        const result = await chat.sendMessage([{ text: text }]);
        const messageContent = result.response.text();

        const chatEngineResponse = await axios.post(
            `https://api.chatengine.io/chats/${activeChatId}/messages/`,
            { text: messageContent },
            {
                headers: {
                    "Project-ID": process.env.PROJECT_ID,
                    "User-Name": process.env.BOT_USER_NAME,
                    "User-Secret": process.env.BOT_USER_SECRET,
                },
            }
        );

        res.status(200).json({
            text: messageContent,
        });
    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
        });
        res.status(500).json({
            error: "An error occurred while processing your request.",
            details: error.response?.data || error.message,
        });
    }
});

// assist

router.post("/assist", async (req, res) => {
    console.log("Received request body:", req.body);

    try {
        const inputText = req.body.text || req.body.this;
        console.log("Input text:", inputText);

        if (!inputText || inputText.trim().length === 0) {
            console.log("Invalid input received");
            return res
                .status(400)
                .json({ error: "Please provide some text to complete." });
        }

        console.log("Processing input text:", inputText);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Complete this sentence naturally, only providing the words to finish it: "${inputText}"`;
        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                maxOutputTokens: 50,
                temperature: 0.4,
                topP: 0.8,
                topK: 40,
            },
        });

        let generatedText = result.response.text().trim();
        generatedText = generatedText.replace(/^["']|["']$/g, "");

        if (generatedText.startsWith(inputText)) {
            generatedText = generatedText.slice(inputText.length).trim();
        }

        console.log("Generated text:", generatedText);

        res.status(200).json({ text: generatedText });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

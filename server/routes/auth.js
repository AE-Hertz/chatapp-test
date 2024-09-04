import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/login", async (req, res) => {
    console.log("Login request body:", req.body);

    try {
        const { username, password } = req.body;

        const chatEngineResponse = await axios.get(
            "https://api.chatengine.io/users/me/",
            {
                headers: {
                    "Project-ID": process.env.PROJECT_ID,
                    "User-Name": username,
                    "User-Secret": password,
                },
            }
        );

        res.status(200).json({ response: chatEngineResponse.data });
    } catch (error) {
        console.error("Login error:", error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
});

router.post("/signup", async (req, res) => {
    console.log("Signup request body:", req.body);

    try {
        const { username, password } = req.body;

        const chatEngineResponse = await axios.post(
            "https://api.chatengine.io/users/",
            {
                username: username,
                secret: password,
            },
            {
                headers: {
                    "Private-Key": process.env.PRIVATE_KEY,
                },
            }
        );

        res.status(200).json({ response: chatEngineResponse.data });
    } catch (error) {
        console.error("Signup error:", error.response ? error.response.data : error.message);
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
        });
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
});

export default router;

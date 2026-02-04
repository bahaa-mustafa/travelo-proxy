
import express from "express";
import fetch from "node-fetch";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const BACKEND_BASE_URL = "http://traveloo.runasp.net";

app.use(express.json());

/**
 * ✅ HANDLE PREFLIGHT MANUALLY (CRITICAL)
 */
// ✅ Universal CORS Middleware (Express 5 Compatible)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://travelo-t.netlify.app");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, HEAD"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, Origin, X-Requested-With"
  );
  res.setHeader("Vary", "Origin");

  // Handle Preflight (OPTIONS) directly in middleware
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

/**
 * 🔁 GENERIC PROXY
 */

// Ai chat bot
app.post("/ai/chatbot", async (req, res) => {
  try {
    const response = await fetch(
      "https://ayamotawea-Tourism-Chatbot.hf.space/answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_TOKEN}`
        },
        body: JSON.stringify({ text: req.body.text })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Chatbot failed" });
  }
});


// images
app.use("/img", async (req, res) => {
  try {
    // req.path = /Cities/NewYork.jpg
    const imageUrl = BACKEND_BASE_URL + req.path;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(response.status).end();
    }

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.setHeader("Cache-Control", "public, max-age=86400");

    response.body.pipe(res);
  } catch (err) {
    console.error("Image proxy error:", err);
    res.status(500).end();
  }
});


// general
app.use("/api", async (req, res) => {
  try {
    const targetUrl =
      BACKEND_BASE_URL + req.originalUrl.replace("/api", "");

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : JSON.stringify(req.body),
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Proxy error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Proxy running on port", PORT);
});

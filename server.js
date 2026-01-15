// import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";

// const app = express();
// const BACKEND_BASE_URL = "http://traveloo.runasp.net";

// const corsOptions = {
//   origin: "https://travelo-t.netlify.app",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

// app.use(express.json());

// app.use("/api", async (req, res) => {
//   try {
//     const targetUrl = BACKEND_BASE_URL + req.originalUrl.replace("/api", "");

//     const response = await fetch(targetUrl, {
//       method: req.method,
//       headers: {
//         "Content-Type": "application/json",
//         ...(req.headers.authorization && {
//           Authorization: req.headers.authorization,
//         }),
//       },
//       body:
//         req.method === "GET" || req.method === "HEAD"
//           ? undefined
//           : JSON.stringify(req.body),
//     });

//     const text = await response.text();


//     res.setHeader(
//       "Access-Control-Allow-Origin",
//       "https://travelo-t.netlify.app"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     res.setHeader("Vary", "Origin");

//     res.status(response.status).send(text);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Proxy server error" });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log("✅ Proxy running on port", PORT);
// });


import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const BACKEND_BASE_URL = "http://traveloo.runasp.net";

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

const corsOptions = {
  origin: "*", // Allow all origins for debugging
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());



/**
 * 🔁 GENERIC PROXY
 */
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

// Health Check
app.get("/", (req, res) => {
  res.send("✅ Proxy Server is Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Proxy running on port", PORT);
});

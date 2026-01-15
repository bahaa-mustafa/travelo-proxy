// import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";

// const app = express();
// app.use(cors({
//   origin: "*",
//   credentials: true
// }));
// app.use(express.json());

// const BACKEND_BASE_URL = "http://traveloo.runasp.net";

// app.all("/api/*", async (req, res) => {
//   try {
//     const targetUrl =
//       BACKEND_BASE_URL + req.originalUrl.replace("/api", "");

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

//     const data = await response.text();

//     res.status(response.status).send(data);
//   } catch (err) {
//     res.status(500).json({ message: "Proxy server error" });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () =>
//   console.log("Proxy running on port", PORT)
// );



import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

const BACKEND_BASE_URL = "http://traveloo.runasp.net";


app.use(
  cors({
    origin: "https://travelo-t.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());

app.use(express.json());


app.all("/api/*", async (req, res) => {
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
    res.status(500).json({ message: "Proxy server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Proxy running on port", PORT)
);

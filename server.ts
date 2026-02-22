import express from "express";
import { createServer as createViteServer } from "vite";
import CryptoJS from 'crypto-js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// iKhokha Credentials
const APPLICATION_ID = process.env.IKHOKHA_APP_ID || "IKVFQNM7GAS3P885GC16H1DJ9VLRHWEE";
const APPLICATION_KEY = process.env.IKHOKHA_APP_KEY || "pZXQyVmm7GjGJK7GkYl1GYJHQczlZ4ju";

// API routes
app.post("/api/checkout", async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    if (!amount || !orderId) {
      return res.status(400).json({ error: "Missing amount or orderId" });
    }

    const cleanAmount = parseFloat(Number(amount).toFixed(2));
    
    // Standard iKhokha Paylink v1 structure
    // Using externalTransactionID (uppercase ID) as it previously passed signature validation
    const requestBody = {
      entityID: APPLICATION_ID.trim(),
      amount: cleanAmount,
      currency: "ZAR",
      externalTransactionID: orderId,
      paymentReference: orderId,
      description: "Mzantsi Bites Order",
      mode: "test", // Try test mode as these credentials look like test ones
      requesterUrl: "https://mzantsibites.store",
      urls: {
        callbackUrl: "https://mzantsibites.store/callback",
        successPageUrl: "https://mzantsibites.store/success",
        failurePageUrl: "https://mzantsibites.store/failure",
        cancelUrl: "https://mzantsibites.store/cancel"
      }
    };

    // iKhokha is extremely sensitive to the exact string used for the signature.
    // We must ensure the body sent is identical to the body signed.
    const bodyString = JSON.stringify(requestBody);
    const basePath = "/public-api/v1/api/payment";
    const payloadToSign = basePath + bodyString;
    
    const signature = CryptoJS.HmacSHA256(
      payloadToSign, 
      APPLICATION_KEY.trim()
    ).toString(CryptoJS.enc.Hex).toLowerCase();

    console.log("--- iKhokha Debug Info ---");
    console.log("Payload to Sign:", payloadToSign);
    console.log("Signature:", signature);
    console.log("--------------------------");

    const response = await fetch("https://api.ikhokha.com/public-api/v1/api/payment", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'IK-APPID': APPLICATION_ID.trim(),
        'IK-SIGN': signature,
      },
      body: bodyString
    });

    const data = await response.json();
    console.log("iKhokha API Response:", JSON.stringify(data, null, 2));

    if (!response.ok || data.responseCode !== "00") {
      console.error("iKhokha API Error Status:", response.status);
      console.error("iKhokha API Error Data:", data);
      return res.status(response.status === 200 ? 400 : response.status).json(data);
    }

    res.json(data);
  } catch (error: any) {
    console.error("iKhokha Server Error:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();

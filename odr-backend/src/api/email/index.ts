import express, { Request, Response } from "express";
// import testTwilioHandler from "./twilio";


import { authenticateJWT } from "../../middleware/auth";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiter - strict in prod, lenient in dev
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === "production" ? 5 : 50,
  message: { error: "Too many requests, please try again after a minute." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV !== "production" // skip limiter in dev
});

// ✅ define handler properly
async function testHandler(req: Request, res: Response) {
  try {
    console.log("test API call");
    return res.json({ message: "Test API call successful" });
  } catch (err) {
    console.error("Error in testHandler:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

// ✅ register routes

// router.post("/testTwilio", authLimiter, testTwilioHandler);



export default router;

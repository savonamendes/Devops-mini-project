import axios from "axios";
import { Router, Request, Response } from "express";

const router = Router();
const lambdaChatUrl = process.env.LAMBDA_CHAT_URL || "";

// Store conversation history per session (in production, use Redis or database)
const sessionHistory = new Map<string, Array<{
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
}>>();

async function callLambdaChat(message: string): Promise<string> {
  if (!lambdaChatUrl) {
    throw new Error("LAMBDA_CHAT_URL is not configured");
  }

  const response = await axios.post(
    lambdaChatUrl,
    { text: message },
    { headers: { "Content-Type": "application/json" } }
  );

  const data = response.data;
  if (typeof data === "string") {
    return data;
  }

  if (data.output) {
    return data.output;
  }

  if (data.body) {
    if (typeof data.body === "string") {
      try {
        const parsedBody = JSON.parse(data.body);
        return parsedBody.output ?? JSON.stringify(parsedBody);
      } catch {
        return data.body;
      }
    }

    if (typeof data.body.output === "string") {
      return data.body.output;
    }
  }

  return JSON.stringify(data);
}

// Chat endpoint with optimization
router.post("/", async (req: Request, res: Response) => {
  try {
    const { message, sessionId, detail = false } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required" });
    }

    // Generate session ID if not provided
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get or create session history
    let history = sessionHistory.get(currentSessionId) || [];
    
    const optimizedResponse = await callLambdaChat(
      detail ? `Please provide detailed explanation: ${message}` : message
    );

    // Update session history
    history.push(
      { role: "user", content: message, timestamp: new Date().toISOString() },
      { role: "assistant", content: optimizedResponse, timestamp: new Date().toISOString() }
    );
    
    // Keep only recent history to prevent memory bloat
    if (history.length > 12) {
      history = history.slice(-8); // Keep last 4 pairs
    }
    
    sessionHistory.set(currentSessionId, history);

    return res.json({
      response: optimizedResponse,
      sessionId: currentSessionId,
      canExpand: !detail && optimizedResponse.length < 200 // Show expand option for short responses
    });

  } catch (error: any) {
    console.error("Lambda chat API error:", error);

    if (error.response?.status === 429 || error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again later."
      });
    }

    return res.status(500).json({
      error: "Failed to get response from AI service",
      details: process.env.NODE_ENV !== 'production' ? String(error) : undefined
    });
  }
});

export default router;
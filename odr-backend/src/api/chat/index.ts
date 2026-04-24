import axios from "axios";
import { Router, Request, Response } from "express";

const router = Router();
const rawLambdaChatUrl = process.env.LAMBDA_CHAT_URL || "https://f8nrnm8pk1.execute-api.us-east-1.amazonaws.com/dev/chat";

function resolveLambdaChatUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  // Accept either .../dev or .../dev/chat and normalize to .../dev/chat.
  return trimmed.endsWith("/chat") ? trimmed : `${trimmed}/chat`;
}

const lambdaChatUrl = resolveLambdaChatUrl(rawLambdaChatUrl);

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
    { message },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );

  const data = response.data;
  
  // Handle the API response format: { reply: "..." }
  if (data.reply && typeof data.reply === "string") {
    return data.reply;
  }

  // Fallback: return stringified data if reply not found
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
    const upstreamStatus = error?.response?.status;
    const upstreamBody = error?.response?.data;
    console.error("Lambda chat API error:", {
      message: error?.message,
      endpoint: lambdaChatUrl,
      upstreamStatus,
      upstreamBody,
    });

    if (upstreamStatus === 429 || error.status === 429) {
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
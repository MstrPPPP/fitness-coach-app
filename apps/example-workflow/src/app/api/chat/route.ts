import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 60000; // 60 seconds for chat responses

interface ChatRequestBody {
  sessionId: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();

    if (!body.sessionId || !body.message) {
      return NextResponse.json(
        { error: "Missing sessionId or message" },
        { status: 400 }
      );
    }

    const webhookBaseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD
        : process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV;

    const workflowId = process.env.WORKFLOW_ID;

    if (!webhookBaseUrl || !workflowId) {
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const webhookUrl = `${webhookBaseUrl}/${workflowId}`;

    // n8n Chat Trigger payload format
    const payload = {
      action: "sendMessage",
      sessionId: body.sessionId,
      chatInput: body.message,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error("n8n error:", errorText);
        return NextResponse.json(
          { error: `Workflow error: ${n8nResponse.status}` },
          { status: n8nResponse.status }
        );
      }

      // Read the response as text to handle NDJSON from n8n chat triggers
      const responseText = await n8nResponse.text();

      // n8n chat trigger returns NDJSON (newline-delimited JSON)
      // Each line is a separate JSON object like:
      // {"type":"begin",...}
      // {"type":"item","output":"Hello",...}
      // {"type":"end",...}

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const lines = responseText.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);

              // Extract content from n8n NDJSON format
              if (parsed.type === "item" || parsed.output || parsed.text) {
                const content =
                  parsed.output || parsed.text || parsed.content || "";
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ chunk: content })}\n\n`)
                  );
                }
              }
            } catch {
              // If line isn't valid JSON, skip it
              console.warn("Skipping non-JSON line:", line);
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timeout - the coach is taking too long to respond" },
          { status: 504 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

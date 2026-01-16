import { NextRequest, NextResponse } from "next/server";
import { callN8nWebhook, getWebhookUrl } from "@repo/lib/n8n";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate input with your schema
    // const validated = yourInputSchema.parse(body);

    const workflowId = process.env.WORKFLOW_ID;
    if (!workflowId) {
      return NextResponse.json(
        { error: "Workflow not configured" },
        { status: 500 }
      );
    }

    const webhookUrl = getWebhookUrl(
      workflowId,
      process.env.NODE_ENV === "production" ? "production" : "development"
    );

    const result = await callN8nWebhook(webhookUrl, body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Workflow execution failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Workflow API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResultDisplay } from "./result-display";

// TODO: Define your workflow input schema
const formSchema = z.object({
  input: z.string().min(1, "Input is required"),
});

type FormData = z.infer<typeof formSchema>;

export function WorkflowForm() {
  const [result, setResult] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Request failed");
      }

      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
        <div className="p-6 space-y-1.5">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Workflow Input
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter your data to process through the n8n workflow
          </p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...form.register("input")}
                placeholder="Enter input..."
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {form.formState.errors.input && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.input.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="bg-card text-card-foreground rounded-lg border border-destructive shadow-sm">
          <div className="p-6 space-y-1.5">
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-destructive">
              Error
            </h3>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {result ? (<ResultDisplay data={result as Record<string, unknown>} />) : null}
    </div>
  );
}

import { WorkflowForm } from "@/components/workflow-form";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Workflow App</h1>
          <p className="text-muted-foreground mt-2">
            Powered by n8n workflow automation
          </p>
        </div>

        <WorkflowForm />
      </div>
    </main>
  );
}

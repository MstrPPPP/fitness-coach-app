interface ResultDisplayProps {
  data: unknown;
}

export function ResultDisplay({ data }: ResultDisplayProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
      <div className="p-6 space-y-1.5">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Result
        </h3>
      </div>
      <div className="p-6 pt-0">
        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

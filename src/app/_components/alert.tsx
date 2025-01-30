import { AlertCircle } from "lucide-react";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDestructive() {
  return (
    <Alert className="bg-secondary gap-4" variant="destructive">
      <AlertCircle />
      <AlertTitle>Алдаа!</AlertTitle>
      <AlertDescription>Бүх талбарыг бөглөнө үү!</AlertDescription>
    </Alert>
  );
}

export function AlertDemo() {
  return (
    <Alert className="bg-foreground text-background gap-4 ">
      <AlertDescription>Амжилттай!</AlertDescription>
    </Alert>
  );
}

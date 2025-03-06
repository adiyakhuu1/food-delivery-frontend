import { AlertCircle } from "lucide-react";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDestructive({
  success,
  message,
}: {
  success: boolean | undefined;
  message: string | undefined;
}) {
  return (
    <Alert className="bg-secondary gap-4" variant="destructive">
      <AlertCircle />
      <AlertTitle>Алдаа!</AlertTitle>
      <AlertDescription>
        {success ? (
          <div className=" text-green-400 ">{message}</div>
        ) : (
          <div className=" text-red-400">
            {message === "jwt expired" && `Ахин нэвтэрнэ үү!`}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function AlertDemo({
  success,
  message,
}: {
  success: boolean;
  message: string;
}) {
  return (
    <Alert className="bg-foreground text-background gap-4 ">
      <AlertDescription>
        {success ? (
          <div className=" text-green-400 ">{message}</div>
        ) : (
          <div className=" text-red-400">{message}</div>
        )}
      </AlertDescription>
    </Alert>
  );
}

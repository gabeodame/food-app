import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Dish Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The dish you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/dishes">View All Dishes</Link>
        </Button>
      </div>
    </div>
  );
}

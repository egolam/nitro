import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="h-96 rounded overflow-hidden bg-background shadow-lg">
      <div className="w-full h-1/2 bg-muted relative">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <CardHeader className="gap-2 p-0">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/2" /> {/* Factory Name */}
            <Skeleton className="h-5 w-16" /> {/* Gender Badge */}
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-1/4" /> {/* Label */}
            <Skeleton className="h-4 w-3/4" /> {/* Brand + Perfume */}
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-1/3 self-end" /> {/* Price */}
            <Skeleton className="h-5 w-full rounded-xs" /> {/* Progress Bar */}
          </div>
        </CardContent>
        <CardFooter className="gap-2 p-0 mt-4">
          <Skeleton className="flex-1 h-8 rounded" /> {/* Button */}
        </CardFooter>
      </div>
    </Card>
  );
}

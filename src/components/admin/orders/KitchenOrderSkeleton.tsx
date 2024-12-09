import { Skeleton } from "@/components/ui/skeleton";

export const KitchenOrderSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
};
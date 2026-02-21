import { Skeleton } from "@/components/ui/skeleton";

interface JournalCardSkeletonProps {
  isVisible?: boolean;
}

export default function JournalCardSkeleton({ isVisible = true }: JournalCardSkeletonProps) {
  if (!isVisible) return null;
  return (
    <div className="flex flex-col gap-2 min-w-[200px] rounded-xl border border-neutral-200 bg-neutral-100 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-16 w-full mt-2" />
    </div>
  );
}

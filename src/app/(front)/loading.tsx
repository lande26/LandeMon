import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-8 px-4 py-8 md:px-10 mt-20 pb-20">
      <Skeleton className="h-10 w-48 bg-neutral-800/80" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-xl bg-neutral-800/80" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-neutral-800/80" />
            <Skeleton className="h-4 w-1/2 rounded-md bg-neutral-800/80" />
          </div>
        ))}
      </div>
    </div>
  );
}

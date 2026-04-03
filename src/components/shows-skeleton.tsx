'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ShowsSkeletonProps {
  count?: number;
  classname?: string;
  variant?: 'with-title' | 'without-title';
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

const ShowsSkeleton = ({
  count = 12,
  classname = '',
  variant = 'with-title',
}: ShowsSkeletonProps) => {
  if (variant === 'without-title') {
    return (
      <motion.div
        className="no-scrollbar container mx-0 flex w-full items-center gap-3 overflow-x-auto overflow-y-hidden py-2"
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
        {Array.from({ length: count }, (_, i) => (
          <motion.div key={i} variants={cardVariants} className="flex-shrink-0">
            <Skeleton className="aspect-[2/3] min-w-[10rem] rounded-lg bg-secondary" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'no-scrollbar container mx-0 w-full max-w-[100%] overflow-x-auto overflow-y-hidden',
        classname,
      )}>
      {/* Section title skeleton */}
      <Skeleton className="mb-3 h-[1.4rem] w-32 rounded-md bg-secondary" />

      {/* Grid of poster skeletons */}
      <motion.div
        className={cn(
          'grid gap-x-2 gap-y-4',
          'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6',
          'xs:gap-y-5 sm:gap-y-6 md:gap-y-8',
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
        {Array.from({ length: count }, (_, i) => (
          <motion.div key={i} variants={cardVariants}>
            <div className="flex flex-col gap-2">
              {/* Poster */}
              <Skeleton className="aspect-[2/3] w-full rounded-lg bg-secondary" />
              {/* Optional title line below poster */}
              <Skeleton className="h-3 w-3/4 rounded bg-secondary/70" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ShowsSkeleton;

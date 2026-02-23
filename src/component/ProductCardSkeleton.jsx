import React from "react";

/**
 * Skeleton loader for product cards - shows placeholder while products load.
 * Use count prop to render multiple skeletons (e.g. count={12} for a grid).
 */
const ProductCardSkeleton = ({ count = 6 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {skeletons.map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
        >
          {/* Image placeholder */}
          <div className="w-full h-80 bg-gray-200" />

          {/* Content placeholder */}
          <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="flex justify-between pt-2">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-5 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCardSkeleton;

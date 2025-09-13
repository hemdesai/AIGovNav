/**
 * Reusable Skeleton Loader Components
 */

import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-full"></div>
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="animate-pulse">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3 border-b">
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      {/* Table Rows */}
      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-6 gap-4 items-center">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex justify-end space-x-2">
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="text-center animate-pulse">
        <div className="inline-flex p-3 rounded-lg bg-gray-200 mb-3">
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
      </div>
    ))}
  </div>
);
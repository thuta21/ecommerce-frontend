'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showingFrom: number;
  showingTo: number;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showingFrom,
  showingTo,
  totalItems,
}: PaginationProps) {
  // Generate page numbers to display for desktop
  const getDesktopPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Near the beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Generate page numbers to display for mobile (simplified)
  const getMobilePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 1) {
        // At the beginning
        pages.push(1, 2, '...');
      } else if (currentPage === totalPages) {
        // At the end
        pages.push('...', totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push('...', currentPage, '...');
      }
    }
    
    return pages;
  };

  const desktopPageNumbers = getDesktopPageNumbers();
  const mobilePageNumbers = getMobilePageNumbers();

  return (
    <div className="flex flex-col gap-4 py-6">
      {/* Results info */}
      <div className="text-sm text-gray-700 text-center sm:text-left">
        Showing <span className="font-medium">{showingFrom}</span> to{' '}
        <span className="font-medium">{showingTo}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Mobile Pagination (simplified) */}
      <div className="flex sm:hidden items-center justify-between gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Prev</span>
        </Button>

        {/* Mobile page numbers */}
        <div className="flex items-center gap-1">
          {mobilePageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-8 h-8">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className="w-8 h-8 p-0 text-sm"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop Pagination (full featured) */}
      <div className="hidden sm:flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        </div>

        {/* Desktop page numbers */}
        <div className="flex items-center gap-1">
          {desktopPageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-8 h-8">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile page info */}
      <div className="text-xs text-gray-500 text-center sm:hidden">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
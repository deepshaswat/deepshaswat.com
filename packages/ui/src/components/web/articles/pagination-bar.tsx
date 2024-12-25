"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxPage = totalPages - 1;
  const displayPage = currentPage + 1;

  const handlePageClick = (page: number) => {
    if (page >= 0 && page <= maxPage) {
      onPageChange(page);
    }
  };

  return (
    <>
      <Pagination className='mt-4'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
              className={
                currentPage === 0
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {displayPage > 2 && (
            <PaginationItem>
              <PaginationLink href='#' onClick={() => handlePageClick(0)}>
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {displayPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {displayPage > 1 && (
            <PaginationItem>
              <PaginationLink
                href='#'
                onClick={() => handlePageClick(displayPage - 2)}
              >
                {displayPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              href='#'
              isActive
              onClick={() => handlePageClick(displayPage - 1)}
              className='bg-neutral-600'
            >
              {displayPage}
            </PaginationLink>
          </PaginationItem>

          {displayPage < maxPage + 1 && (
            <PaginationItem>
              <PaginationLink
                href='#'
                onClick={() => handlePageClick(displayPage)}
              >
                {displayPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {displayPage < maxPage && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {displayPage < maxPage && (
            <PaginationItem>
              <PaginationLink href='#' onClick={() => handlePageClick(maxPage)}>
                {maxPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={() =>
                currentPage < maxPage && onPageChange(currentPage + 1)
              }
              className={
                currentPage === maxPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

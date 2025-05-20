"use client";

import { usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function PaginationPage({
  currentPage,
  currentPageSize,
  lastPage,
}: {
  currentPage: number;
  currentPageSize: number;
  lastPage: number;
}) {
  const pathname = usePathname();

  // TODO: reject pageSize with value negative
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            scroll={false}
            href={`${pathname}?pageSize=${currentPageSize}&page=${getPrevPage(currentPage)}`}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={
              currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            scroll={false}
            href={`${pathname}?pageSize=${currentPageSize}&page=${currentPage + 1}`}
            aria-disabled={currentPage === lastPage}
            tabIndex={currentPage === lastPage ? -1 : undefined}
            className={
              currentPage === lastPage
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getPrevPage(currPage: number): number {
  return currPage === 1 ? currPage : currPage - 1;
}
